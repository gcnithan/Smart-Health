const express = require("express");
const cors = require("cors");
const sensorRoutes = require("./routes/sensor.routes");
const mlRoutes = require("./routes/ml.routes");
const diseaseRoutes = require("./routes/disease.routes");
const userRoutes = require("./routes/user.routes");
const districtRoutes = require("./routes/district.routes");
const talukRoutes = require("./routes/taluk.routes");
const hobliRoutes = require("./routes/hobli.routes");
const villageRoutes = require("./routes/village.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use("/api/sensors", sensorRoutes);
app.use("/api/ml", mlRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/taluks", talukRoutes);
app.use("/api/hoblis", hobliRoutes);
app.use("/api/villages", villageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
