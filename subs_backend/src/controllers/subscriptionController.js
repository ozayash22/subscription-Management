const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Plan = require("../models/Plan");
const User = require("../models/User");
const Subscription = require("../models/Subscription");

exports.createSubscription = async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) return res.status(400).json({ message: "planId required" });

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Create Stripe Customer if not exists
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
      });

      user.stripeCustomerId = customer.id;
      await user.save();

      customerId = customer.id;
    }

    // 2. Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    });

    return res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const sub = await Subscription.findOne({ user: req.user._id });

    if (!sub) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Cancel in Stripe
    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    sub.cancelAtPeriodEnd = true;
    await sub.save();

    res.json({ message: "Subscription will be canceled at period end" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changePlan = async (req, res) => {
  try {
    const { newPlanId } = req.body;

    const sub = await Subscription.findOne({ user: req.user._id });
    const newPlan = await Plan.findById(newPlanId);

    if (!sub || !newPlan) {
      return res.status(404).json({ message: "Subscription or plan not found" });
    }

    // Get Stripe subscription
    const stripeSub = await stripe.subscriptions.retrieve(
      sub.stripeSubscriptionId
    );

    // Update price in Stripe
    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      items: [
        {
          id: stripeSub.items.data[0].id,
          price: newPlan.stripePriceId,
        },
      ],
      proration_behavior: "create_prorations",
    });

    // Update local DB
    sub.plan = newPlan._id;
    await sub.save();

    res.json({ message: "Plan updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};