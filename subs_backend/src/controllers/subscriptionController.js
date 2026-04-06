const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Plan = require("../models/Plan");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const LIVE_STATUSES = ["active", "past_due", "incomplete"];

const findLiveSubscription = (userId) =>
  Subscription.findOne({
    user: userId,
    status: { $in: LIVE_STATUSES },
  }).populate("plan");

exports.createSubscription = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: "planId required" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (!plan.stripePriceId) {
      return res.status(400).json({ message: "Plan is not linked to Stripe price" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingSub = await findLiveSubscription(user._id);
    if (existingSub) {
      return res.status(409).json({
        message: "User already has an active subscription",
        subscriptionId: existingSub._id,
      });
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      user.stripeCustomerId = customer.id;
      await user.save();
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customerId,
      line_items: [{ price: plan.stripePriceId, quantity: 1 }],
      client_reference_id: user._id.toString(),
      metadata: {
        planId: plan._id.toString(),
        userId: user._id.toString(),
      },
      subscription_data: {
        metadata: {
          planId: plan._id.toString(),
          userId: user._id.toString(),
        },
      },
      success_url: `${FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/cancel`,
    });

    return res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getMySubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id }).populate("plan");
    return res.json({ subscription: sub || null });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const sub = await findLiveSubscription(req.user._id);

    if (!sub) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    if (!sub.stripeSubscriptionId) {
      return res.status(400).json({ message: "Missing Stripe subscription id" });
    }

    const updatedStripeSub = await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    sub.cancelAtPeriodEnd = !!updatedStripeSub.cancel_at_period_end;
    sub.currentPeriodEnd = updatedStripeSub.current_period_end
      ? new Date(updatedStripeSub.current_period_end * 1000)
      : sub.currentPeriodEnd;

    await sub.save();

    return res.json({
      message: "Subscription will be canceled at period end",
      subscription: sub,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.changePlan = async (req, res) => {
  try {
    const { newPlanId } = req.body;

    if (!newPlanId) {
      return res.status(400).json({ message: "newPlanId required" });
    }

    const sub = await findLiveSubscription(req.user._id);
    if (!sub) {
      return res.status(404).json({ message: "No active subscription found" });
    }

    const newPlan = await Plan.findById(newPlanId);
    if (!newPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    if (!newPlan.stripePriceId) {
      return res.status(400).json({ message: "Selected plan is not linked to Stripe price" });
    }

    if (sub.plan && sub.plan._id.toString() === newPlan._id.toString()) {
      return res.status(400).json({ message: "Already on this plan" });
    }

    const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
    const stripeItemId = stripeSub.items?.data?.[0]?.id;

    if (!stripeItemId) {
      return res.status(400).json({ message: "Stripe subscription item not found" });
    }

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      items: [{ id: stripeItemId, price: newPlan.stripePriceId }],
      proration_behavior: "create_prorations",
      metadata: {
        planId: newPlan._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    sub.plan = newPlan._id;
    await sub.save();

    const updated = await Subscription.findById(sub._id).populate("plan");

    return res.json({
      message: "Plan updated successfully (proration handled by Stripe)",
      subscription: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};