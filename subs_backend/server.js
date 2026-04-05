const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db.js");
const authRoutes = require("./src/routes/authRoutes");
const planRoutes = require("./src/routes/planRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const webhookRoutes = require("./src/routes/webhookRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");

dotenv.config();

const app = express();


// Middleware
app.use(cors());

app.use("/api/webhooks", webhookRoutes);
app.use(express.json());

// Connect DB
connectDB();

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/analytics", analyticsRoutes);

// app.use(express.json());

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));