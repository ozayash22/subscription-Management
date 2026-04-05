const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const Payment = require("../models/Payment");

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.log("Webhook Error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 🔥 Handle events
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSession(event.data.object);
      break;

    case "invoice.payment_succeeded":
      const invoice = event.data.object;

      const customerId = invoice.customer;

      // 🔥 Find user from Stripe customer ID
      const user = await User.findOne({ stripeCustomerId: customerId });

      await Payment.create({
        user: user?._id || null,
        amount: invoice.amount_paid / 100,
        status: "succeeded",
        stripePaymentIntentId: invoice.payment_intent,
        invoiceId: invoice.id,
      });

      console.log("Payment stored with user");
      break;

    case "invoice.payment_failed":
      const failedInvoice = event.data.object;

      const failedUser = await User.findOne({
        stripeCustomerId: failedInvoice.customer,
      });

      console.log("Payment failed for user:", failedUser?._id);
      break;

    case "customer.subscription.updated":
      const sub = event.data.object;

      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        {
          status: sub.status,
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      );

      console.log("Subscription updated");
      break;

    case "customer.subscription.deleted":
      const deletedSub = event.data.object;

      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId: deletedSub.id },
        { status: "canceled" },
      );

      console.log("Subscription canceled");
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

const handleCheckoutSession = async (session) => {
  try {
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    // 1. Get user
    const user = await User.findOne({ stripeCustomerId: customerId });

    if (!user) {
      console.log("User not found");
      return;
    }

    // 2. Get subscription from Stripe
    const stripeSub = await stripe.subscriptions.retrieve(subscriptionId);

    // 3. Save in DB
    await Subscription.create({
      user: user._id,
      stripeSubscriptionId: subscriptionId,
      status: stripeSub.status,
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
    });

    console.log("Subscription saved");
  } catch (error) {
    console.log("Error handling checkout:", error.message);
  }
};
