const express = require("express");
const router = express.Router();
const { handleStripeWebhook } = require("../webhooks/stripeWebhook");

// ⚠️ RAW body required
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;