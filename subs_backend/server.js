const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const client = require("prom-client");

const connectDB = require("./src/config/db.js");
const authRoutes = require("./src/routes/authRoutes");
const planRoutes = require("./src/routes/planRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const webhookRoutes = require("./src/routes/webhookRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");

const app = express();

// Middleware
app.use(cors());

// Stripe webhooks require raw body and must be before express.json()
app.use("/api/webhooks", webhookRoutes);
app.use(express.json());

// Connect DB
connectDB();

// Metrics
client.collectDefaultMetrics();

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});

app.use((req, res, next) => {
  httpRequestCounter.inc();
  next();
});

// Health
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/analytics", analyticsRoutes);

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.statusCode || err.status || 500;

  return res.status(status).json({
    message: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));