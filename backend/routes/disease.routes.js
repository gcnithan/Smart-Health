const express = require("express");
const DiseaseController = require("../controllers/diseaseController");
const router = express.Router();

// Disease Prediction Routes

// POST /api/disease/predict - Predict disease based on sensor data and symptoms
router.post("/predict", DiseaseController.predictDisease);

// GET /api/disease/history - Get prediction history
router.get("/history", DiseaseController.getPredictionHistory);

// GET /api/disease/prediction/:id - Get specific prediction by ID
router.get("/prediction/:id", DiseaseController.getPredictionById);

// GET /api/disease/statistics - Get prediction statistics
router.get("/statistics", DiseaseController.getPredictionStatistics);

// GET /api/disease/health - ML service health check
router.get("/health", DiseaseController.healthCheck);

// GET /api/disease/recommendations/:diseaseType - Get disease-specific recommendations
router.get("/recommendations/:diseaseType", DiseaseController.getDiseaseRecommendations);

module.exports = router;
