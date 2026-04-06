const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db.js");
const authRoutes = require("./src/routes/authRoutes");
const planRoutes = require("./src/routes/planRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const webhookRoutes = require("./src/routes/webhookRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const client = require("prom-client");

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


// Create default metrics
client.collectDefaultMetrics();

// Create custom metrics (optional)
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
});

// Middleware to count requests
app.use((req, res, next) => {
  httpRequestCounter.inc();
  next();
});

// Metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));