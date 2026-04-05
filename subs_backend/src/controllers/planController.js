const Plan = require("../models/Plan");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create Plan
exports.createPlan = async (req, res) => {
  try {
    const { name, price, billingCycle, features } = req.body;

    // 1. Create product in Stripe
    const product = await stripe.products.create({
      name,
    });

    // 2. Create price in Stripe
    const stripePrice = await stripe.prices.create({
      unit_amount: price * 100, // cents
      currency: "usd",
      recurring: {
        interval: billingCycle === "monthly" ? "month" : "year",
      },
      product: product.id,
    });

    // 3. Save in DB
    const plan = await Plan.create({
      name,
      price,
      billingCycle,
      stripePriceId: stripePrice.id,
      features,
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all plans
exports.getPlans = async (req, res) => {
  const plans = await Plan.find();
  res.json(plans);
};