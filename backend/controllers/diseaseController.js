const MLService = require("../services/mlService");
const db = require("../config/config");

class DiseaseController {
  constructor() {
    this.mlService = new MLService();
  }

  // Predict disease based on sensor data and symptoms
  static async predictDisease(req, res) {
    try {
      const { sensorData, symptoms, diseaseType = 'all' } = req.body;
      
      console.log("🔮 Starting disease prediction...");
      
      // Validate input data
      if (!sensorData || !symptoms) {
        return res.status(400).json({
          success: false,
          message: "Sensor data and symptoms are required"
        });
      }

      // Get latest sensor data if not provided
      let latestSensorData = sensorData;
      if (!sensorData.temperature && !sensorData.pH && !sensorData.EC) {
        latestSensorData = await DiseaseController.getLatestSensorData();
      }

      // Create ML service instance
      const mlService = new MLService();
      
      // Perform prediction
      const prediction = await mlService.predictDisease(latestSensorData, symptoms, diseaseType);
      
      // Save prediction to database
      const savedPrediction = await DiseaseController.savePrediction({
        sensorData: latestSensorData,
        symptoms: symptoms,
        prediction: prediction,
        diseaseType: diseaseType,
        timestamp: new Date()
      });

      console.log("✅ Disease prediction completed successfully");
      
      res.status(200).json({
        success: true,
        message: "Disease prediction completed successfully",
        data: {
          predictionId: savedPrediction.id,
          prediction: prediction,
          sensorData: latestSensorData,
          symptoms: symptoms,
          timestamp: savedPrediction.timestamp
        }
      });
      
    } catch (error) {
      console.error("❌ Error in disease prediction:", error);
      res.status(500).json({
        success: false,
        message: "Disease prediction failed",
        error: error.message
      });
    }
  }

  // Get latest sensor data from database
  static async getLatestSensorData() {
    try {
      const sensorReadingsRef = db.collection("sensor_readings");
      const snapshot = await sensorReadingsRef.orderBy("timestamp", "desc").limit(1).get();
      
      if (snapshot.empty) {
        // Return default values if no sensor data available
        return {
          temperature: 25.0,
          pH: 7.0,
          EC: 1.0,
          timestamp: new Date()
        };
      }
      
      const latestReading = snapshot.docs[0].data();
      return {
        temperature: latestReading.temperature,
        pH: latestReading.pH,
        EC: latestReading.EC,
        timestamp: latestReading.timestamp
      };
    } catch (error) {
      console.error("❌ Error fetching latest sensor data:", error);
      // Return default values on error
      return {
        temperature: 25.0,
        pH: 7.0,
        EC: 1.0,
        timestamp: new Date()
      };
    }
  }

  // Save prediction to database
  static async savePrediction(predictionData) {
    try {
      const predictionsRef = db.collection("disease_predictions");
      const docRef = await predictionsRef.add(predictionData);
      
      return {
        id: docRef.id,
        ...predictionData
      };
    } catch (error) {
      console.error("❌ Error saving prediction:", error);
      throw error;
    }
  }

  // Get prediction history
  static async getPredictionHistory(req, res) {
    try {
      const { limit = 10, diseaseType, startDate, endDate } = req.query;
      
      console.log("📚 Fetching prediction history...");
      
      const predictionsRef = db.collection("disease_predictions");
      let query = predictionsRef.orderBy("timestamp", "desc").limit(parseInt(limit));
      
      if (diseaseType) {
        query = query.where("diseaseType", "==", diseaseType);
      }
      
      if (startDate && endDate) {
        query = query
          .where("timestamp", ">=", new Date(startDate))
          .where("timestamp", "<=", new Date(endDate));
      }
      
      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "No predictions found",
          data: []
        });
      }
      
      const predictions = [];
      snapshot.forEach(doc => {
        predictions.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ Retrieved ${predictions.length} predictions`);
      
      res.status(200).json({
        success: true,
        message: "Prediction history retrieved successfully",
        count: predictions.length,
        data: predictions
      });
      
    } catch (error) {
      console.error("❌ Error fetching prediction history:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch prediction history",
        error: error.message
      });
    }
  }

  // Get specific prediction by ID
  static async getPredictionById(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`📖 Fetching prediction: ${id}...`);
      
      const predictionsRef = db.collection("disease_predictions");
      const doc = await predictionsRef.doc(id).get();
      
      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: "Prediction not found"
        });
      }
      
      const predictionData = {
        id: doc.id,
        ...doc.data()
      };
      
      console.log("✅ Retrieved prediction successfully");
      
      res.status(200).json({
        success: true,
        message: "Prediction retrieved successfully",
        data: predictionData
      });
      
    } catch (error) {
      console.error("❌ Error fetching prediction:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch prediction",
        error: error.message
      });
    }
  }

  // Get prediction statistics
  static async getPredictionStatistics(req, res) {
    try {
      console.log("📊 Calculating prediction statistics...");
      
      const predictionsRef = db.collection("disease_predictions");
      const snapshot = await predictionsRef.get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "No predictions found for statistics",
          data: null
        });
      }
      
      const predictions = [];
      snapshot.forEach(doc => {
        predictions.push(doc.data());
      });
      
      // Calculate statistics
      const stats = {
        totalPredictions: predictions.length,
        diseaseTypes: [...new Set(predictions.map(p => p.diseaseType))],
        dateRange: {
          earliest: new Date(Math.min(...predictions.map(p => new Date(p.timestamp)))),
          latest: new Date(Math.max(...predictions.map(p => new Date(p.timestamp))))
        },
        riskDistribution: {
          critical: predictions.filter(p => p.prediction?.overall_risk === 'critical').length,
          high: predictions.filter(p => p.prediction?.overall_risk === 'high').length,
          medium: predictions.filter(p => p.prediction?.overall_risk === 'medium').length,
          low: predictions.filter(p => p.prediction?.overall_risk === 'low').length,
          minimal: predictions.filter(p => p.prediction?.overall_risk === 'minimal').length
        },
        averageConfidence: predictions.reduce((sum, p) => {
          const avgConfidence = p.prediction?.predictions?.reduce((s, pred) => s + pred.confidence, 0) / p.prediction?.predictions?.length || 0;
          return sum + avgConfidence;
        }, 0) / predictions.length
      };
      
      console.log("✅ Calculated prediction statistics");
      
      res.status(200).json({
        success: true,
        message: "Prediction statistics calculated successfully",
        data: stats
      });
      
    } catch (error) {
      console.error("❌ Error calculating prediction statistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to calculate prediction statistics",
        error: error.message
      });
    }
  }

  // ML service health check
  static async healthCheck(req, res) {
    try {
      console.log("🏥 Checking ML service health...");
      
      const mlService = new MLService();
      const healthStatus = await mlService.healthCheck();
      
      res.status(200).json({
        success: true,
        message: "ML service health check completed",
        data: healthStatus
      });
      
    } catch (error) {
      console.error("❌ Error in ML service health check:", error);
      res.status(500).json({
        success: false,
        message: "ML service health check failed",
        error: error.message
      });
    }
  }

  // Get disease-specific recommendations
  static async getDiseaseRecommendations(req, res) {
    try {
      const { diseaseType } = req.params;
      
      console.log(`💡 Getting recommendations for ${diseaseType}...`);
      
      const recommendations = DiseaseController.generateDiseaseRecommendations(diseaseType);
      
      res.status(200).json({
        success: true,
        message: `Recommendations for ${diseaseType}`,
        data: recommendations
      });
      
    } catch (error) {
      console.error("❌ Error getting disease recommendations:", error);
      res.status(500).json({
        success: false,
        message: "Failed to get disease recommendations",
        error: error.message
      });
    }
  }

  // Generate disease-specific recommendations
  static generateDiseaseRecommendations(diseaseType) {
    const recommendations = {
      cholera: {
        immediate_actions: [
          "Administer oral rehydration therapy (ORT)",
          "Collect stool sample for laboratory testing",
          "Isolate patient to prevent spread",
          "Notify local health authorities immediately"
        ],
        preventive_measures: [
          "Ensure access to clean, treated water",
          "Promote proper hand hygiene",
          "Improve sanitation facilities",
          "Vaccinate high-risk populations"
        ],
        monitoring: [
          "Monitor fluid intake and output",
          "Check for signs of dehydration",
          "Monitor vital signs every 2-4 hours",
          "Watch for complications"
        ]
      },
      diarrheal: {
        immediate_actions: [
          "Ensure adequate hydration",
          "Monitor for dehydration signs",
          "Consider zinc supplementation",
          "Maintain proper nutrition"
        ],
        preventive_measures: [
          "Promote exclusive breastfeeding for infants",
          "Ensure safe water and food handling",
          "Improve sanitation and hygiene",
          "Rotavirus vaccination for children"
        ],
        monitoring: [
          "Monitor stool frequency and consistency",
          "Check for signs of dehydration",
          "Monitor weight and fluid balance",
          "Watch for persistent symptoms"
        ]
      },
      typhoid: {
        immediate_actions: [
          "Blood culture and Widal test",
          "Start appropriate antibiotic treatment",
          "Ensure adequate rest and nutrition",
          "Monitor for complications"
        ],
        preventive_measures: [
          "Typhoid vaccination for high-risk areas",
          "Ensure safe water and food sources",
          "Promote proper hand hygiene",
          "Improve sanitation infrastructure"
        ],
        monitoring: [
          "Monitor fever pattern",
          "Check for abdominal symptoms",
          "Monitor for complications (perforation, bleeding)",
          "Follow up on treatment response"
        ]
      }
    };

    return recommendations[diseaseType.toLowerCase()] || {
      message: "No specific recommendations available for this disease type",
      general_advice: [
        "Seek immediate medical attention",
        "Maintain proper hygiene",
        "Ensure adequate hydration",
        "Follow healthcare provider instructions"
      ]
    };
  }
}

module.exports = DiseaseController;
