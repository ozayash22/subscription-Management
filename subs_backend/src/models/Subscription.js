const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      default: null,
    },
    stripeSubscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "canceled", "past_due", "incomplete"],
      default: "active",
      index: true,
    },
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// At most one currently live subscription state per user
subscriptionSchema.index(
  { user: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["active", "past_due", "incomplete"] },
    },
  }
);

module.exports = mongoose.model("Subscription", subscriptionSchema);