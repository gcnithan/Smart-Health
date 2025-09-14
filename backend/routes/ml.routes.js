const express = require("express");
const MLController = require("../controllers/mlController");
const router = express.Router();

// ML Routes
// GET /api/ml/data - Get sensor data for ML processing
router.get("/data", MLController.getMLData);

// GET /api/ml/anomaly-data - Get data for anomaly detection
router.get("/anomaly-data", MLController.getAnomalyData);

// GET /api/ml/trend-data - Get data for trend analysis
router.get("/trend-data", MLController.getTrendData);

// GET /api/ml/predictive-data - Get data for predictive analysis
router.get("/predictive-data", MLController.getPredictiveData);

// GET /api/ml/health-assessment - Get data for health assessment
router.get("/health-assessment", MLController.getHealthAssessmentData);

module.exports = router;
