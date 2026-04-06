const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const Payment = require("../models/Payment");
const Plan = require("../models/Plan");

//stripe listen --forward-to localhost:5000/api/webhooks/stripe

const toDateOrNull = (unixTs) => {
  if (typeof unixTs !== "number" || !Number.isFinite(unixTs)) return null;
  const d = new Date(unixTs * 1000);
  return Number.isNaN(d.getTime()) ? null : d;
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSession(event.data.object);
        break;

      case "invoice.payment_succeeded":
      case "invoice.paid":
      case "invoice_payment.paid": {
        const invoice = event.data.object;
        const user = await User.findOne({ stripeCustomerId: invoice.customer });

        const invoiceId = invoice.id || invoice.invoice || null;
        if (!invoiceId) break;

        const amountPaidCents =
          typeof invoice.amount_paid === "number"
            ? invoice.amount_paid
            : typeof invoice.amount === "number"
              ? invoice.amount
              : 0;

        const paymentIntentId =
          typeof invoice.payment_intent === "string"
            ? invoice.payment_intent
            : typeof invoice.payment?.payment_intent === "string"
              ? invoice.payment.payment_intent
              : null;

        const paymentDoc = {
          user: user?._id || null,
          amount: amountPaidCents / 100,
          status: "succeeded",
          invoiceId,
        };

        if (paymentIntentId) {
          paymentDoc.stripePaymentIntentId = paymentIntentId;
        }

        // Atomic idempotency by invoiceId
        await Payment.updateOne(
          { invoiceId },
          { $setOnInsert: paymentDoc },
          { upsert: true }
        );

        break;
      }

      case "invoice.payment_failed": {
        const failedInvoice = event.data.object;
        const failedUser = await User.findOne({
          stripeCustomerId: failedInvoice.customer,
        });
        console.log("Payment failed for user:", failedUser?._id);
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object;

        // Only update existing subscription row (checkout handler is source of creation)
        await Subscription.updateOne(
          { stripeSubscriptionId: sub.id },
          {
            $set: {
              status: sub.status,
              currentPeriodEnd: toDateOrNull(sub.current_period_end),
              cancelAtPeriodEnd: !!sub.cancel_at_period_end,
            },
          }
        );
        break;
      }

      case "customer.subscription.deleted": {
        const deletedSub = event.data.object;
        await Subscription.updateOne(
          { stripeSubscriptionId: deletedSub.id },
          { $set: { status: "canceled" } }
        );
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return res.json({ received: true });
  } catch (err) {
    console.log("Webhook handler runtime error:", err.message);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};

const handleCheckoutSession = async (session) => {
  try {
    const customerId = session.customer;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) return;

    const user = await User.findOne({ stripeCustomerId: customerId });
    if (!user) return;

    const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

    const planId = session.metadata?.planId || stripeSub.metadata?.planId || null;
    let planRef = null;

    if (planId) {
      const planExists = await Plan.findById(planId).select("_id");
      if (planExists) planRef = planExists._id;
    }

    await Subscription.findOneAndUpdate(
      { stripeSubscriptionId: subscriptionId },
      {
        user: user._id,
        plan: planRef,
        status: stripeSub.status,
        currentPeriodEnd: toDateOrNull(stripeSub.current_period_end),
        cancelAtPeriodEnd: !!stripeSub.cancel_at_period_end,
      },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    );
  } catch (error) {
    console.log("Error handling checkout:", error.message);
  }
};
