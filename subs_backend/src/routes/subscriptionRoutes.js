const express = require("express");
const router = express.Router();

const {
  createSubscription,
  getMySubscription,
  cancelSubscription,
  changePlan,
} = require("../controllers/subscriptionController");

const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createSubscription);
router.get("/me", protect, getMySubscription);
router.post("/cancel", protect, cancelSubscription);
router.post("/changeplan", protect, changePlan);

module.exports = router;