const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");
const Payment = require("../models/Payment");

exports.getAnalytics = async (req, res) => {
  try {
    // 1. Active subscriptions
    const activeSubs = await Subscription.find({ status: "active" }).populate("plan");

    const totalSubscribers = activeSubs.length;

    // 2. MRR Calculation
    let mrr = 0;

    activeSubs.forEach((sub) => {
      if (sub.plan?.billingCycle === "monthly") {
        mrr += sub.plan.price;
      } else if (sub.plan?.billingCycle === "yearly") {
        mrr += sub.plan.price / 12;
      }
    });

    // 3. Total Revenue (all successful payments)
    const payments = await Payment.find({ status: "succeeded" });

    const totalRevenue = payments.reduce((acc, payment) => acc + payment.amount, 0);

    // 4. Churn Rate (basic version)
    const canceledSubs = await Subscription.find({ status: "canceled" });

    const churnRate =
      totalSubscribers + canceledSubs.length === 0
        ? 0
        : (canceledSubs.length / (totalSubscribers + canceledSubs.length)) * 100;

    res.json({
      totalSubscribers,
      mrr: Number(mrr.toFixed(2)),
      totalRevenue: Number(totalRevenue.toFixed(2)),
      churnRate: Number(churnRate.toFixed(2)),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};