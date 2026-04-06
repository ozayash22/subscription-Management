const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const normalizeFeatures = (features) => {
  if (!features) return [];
  if (Array.isArray(features)) return features.map((f) => String(f).trim()).filter(Boolean);
  return String(features)
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);
};

// Create Plan
exports.createPlan = async (req, res) => {
  try {
    let { name, price, billingCycle, features } = req.body;

    name = String(name || "").trim();
    price = Number(price);
    billingCycle = String(billingCycle || "").trim().toLowerCase();
    features = normalizeFeatures(features);

    if (!name) {
      return res.status(400).json({ message: "Plan name is required" });
    }

    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    if (!["monthly", "yearly"].includes(billingCycle)) {
      return res.status(400).json({ message: "billingCycle must be monthly or yearly" });
    }

    const existing = await Plan.findOne({ name, billingCycle, price });
    if (existing) {
      return res.status(409).json({ message: "A similar plan already exists" });
    }

    const product = await stripe.products.create({ name });

    const stripePrice = await stripe.prices.create({
      unit_amount: Math.round(price * 100),
      currency: "usd",
      recurring: { interval: billingCycle === "monthly" ? "month" : "year" },
      product: product.id,
    });

    const plan = await Plan.create({
      name,
      price,
      billingCycle,
      stripePriceId: stripePrice.id,
      features,
    });

    return res.status(201).json(plan);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Delete Plan (admin only)
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const liveSubExists = await Subscription.exists({
      plan: plan._id,
      status: { $in: ["active", "past_due", "incomplete"] },
    });

    if (liveSubExists) {
      return res.status(409).json({
        message: "Cannot delete plan with active subscribers",
      });
    }

    if (plan.stripePriceId) {
      await stripe.prices.update(plan.stripePriceId, { active: false });
    }

    await Plan.deleteOne({ _id: plan._id });

    return res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all plans
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ price: 1, createdAt: -1 });
    return res.json(plans);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};