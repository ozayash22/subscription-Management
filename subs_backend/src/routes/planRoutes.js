const express = require("express");
const router = express.Router();
const { createPlan, getPlans, } = require("../controllers/planController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.post("/", protect, adminOnly, createPlan);
router.get("/", getPlans);

module.exports = router;