const express = require("express");
const router = express.Router();
const { createSubscription } = require("../controllers/subscriptionController");
const { cancelSubscription } = require("../controllers/subscriptionController");
const {changePlan} = require("../controllers/subscriptionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createSubscription);
router.post("/cancel", protect, cancelSubscription);
router.post("/changeplan", protect, changePlan);


module.exports = router;