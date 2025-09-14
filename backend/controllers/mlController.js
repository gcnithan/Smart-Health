const db = require("../config/config");

class MLController {
  // Get sensor data for ML processing
  static async getMLData(req, res) {
    try {
      const { limit = 100, deviceId } = req.query;
      
      console.log(`🤖 Fetching sensor data for ML processing...`);
      
      const sensorReadingsRef = db.collection("sensor_readings");
      let query = sensorReadingsRef.orderBy("timestamp", "desc").limit(parseInt(limit));
      
      if (deviceId) {
        query = query.where("device_id", "==", deviceId);
      }
      
      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "No sensor data found for ML processing",
          data: []
        });
      }
      
      const mlData = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        mlData.push({
          id: doc.id,
          features: {
            temperature: data.temperature,
            pH: data.pH,
            EC: data.EC
          },
          timestamp: data.timestamp,
          device_id: data.device_id
        });
      });
      
      console.log(`✅ Retrieved ${mlData.length} records for ML processing`);
      
      res.status(200).json({
        success: true,
        message: "ML data retrieved successfully",
        count: mlData.length,
        data: mlData
      });
      
    } catch (error) {
      console.error("❌ Error fetching ML data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch ML data",
        error: error.message
      });
    }
  }

  // Get data for anomaly detection
  static async getAnomalyData(req, res) {
    try {
      const { days = 7, deviceId } = req.query;
      
      console.log(`🔍 Fetching data for anomaly detection (last ${days} days)...`);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      
      const sensorReadingsRef = db.collection("sensor_readings");
      let query = sensorReadingsRef
        .where("timestamp", ">=", startDate)
        .where("timestamp", "<=", endDate)
        .orderBy("timestamp", "asc");
      
      if (deviceId) {
        query = query.where("device_id", "==", deviceId);
      }
      
      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "No data found for anomaly detection",
          data: []
        });
      }
      
      const anomalyData = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        anomalyData.push({
          id: doc.id,
          timestamp: data.timestamp,
          device_id: data.device_id,
          temperature: data.temperature,
          pH: data.pH,
          EC: data.EC
        });
      });
      
      console.log(`✅ Retrieved ${anomalyData.length} records for anomaly detection`);
      
      res.status(200).json({
        success: true,
        message: "Anomaly detection data retrieved successfully",
        count: anomalyData.length,
        data: anomalyData
      });
      
    } catch (error) {
      console.error("❌ Error fetching anomaly detection data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch anomaly detection data",
        error: error.message
      });
    }
  }

  // Get data for trend analysis
  static async getTrendData(req, res) {
    try {
      const { days = 30, deviceId, interval = "hour" } = req.query;
      
      console.log(`📈 Fetching data for trend analysis (last ${days} days, ${interval} intervals)...`);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      
      const sensorReadingsRef = db.collection("sensor_readings");
      let query = sensorReadingsRef
        .where("timestamp", ">=", startDate)
        .where("timestamp", "<=", endDate)
        .orderBy("timestamp", "asc");
      
      if (deviceId) {
        query = query.where("device_id", "==", deviceId);
      }
      
      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "No data found for trend analysis",
          data: []
        });
      }
      
      const trendData = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        trendData.push({
          id: doc.id,
          timestamp: data.timestamp,
          device_id: data.device_id,
          temperature: data.temperature,
          pH: data.pH,
          EC: data.EC
        });
      });
      
      // Group data by time intervals if needed
      let processedData = trendData;
      if (interval === "hour") {
        processedData = MLController.groupDataByHour(trendData);
      } else if (interval === "day") {
        processedData = MLController.groupDataByDay(trendData);
      }
      
      console.log(`✅ Retrieved ${processedData.length} data points for trend analysis`);
      
      res.status(200).json({
        success: true,
        message: "Trend analysis data retrieved successfully",
        count: processedData.length,
        interval: interval,
        data: processedData
      });
      
    } catch (error) {
      console.error("❌ Error fetching trend analysis data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch trend analysis data",
        error: error.message
      });
    }
  }

  // Get data for predictive analysis
  static async getPredictiveData(req, res) {
    try {
      const { days = 14, deviceId, predictionType = "all" } = req.query;
      
      console.log(`🔮 Fetching data for predictive analysis (last ${days} days)...`);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      
      const sensorReadingsRef = db.collection("sensor_readings");
      let query = sensorReadingsRef
        .where("timestamp", ">=", startDate)
        .where("timestamp", "<=", endDate)
        .orderBy("timestamp", "asc");
      
      if (deviceId) {
        query = query.where("device_id", "==", deviceId);
      }
      
      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "No data found for predictive analysis",
          data: []
        });
      }
      
      const predictiveData = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        predictiveData.push({
          id: doc.id,
          timestamp: data.timestamp,
          device_id: data.device_id,
          temperature: data.temperature,
          pH: data.pH,
          EC: data.EC
        });
      });
      
      // Process data based on prediction type
      let processedData = predictiveData;
      if (predictionType === "hourly") {
        processedData = MLController.groupDataByHour(predictiveData);
      } else if (predictionType === "daily") {
        processedData = MLController.groupDataByDay(predictiveData);
      }
      
      console.log(`✅ Retrieved ${processedData.length} data points for predictive analysis`);
      
      res.status(200).json({
        success: true,
        message: "Predictive analysis data retrieved successfully",
        count: processedData.length,
        predictionType: predictionType,
        data: processedData
      });
      
    } catch (error) {
      console.error("❌ Error fetching predictive analysis data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch predictive analysis data",
        error: error.message
      });
    }
  }

  // Get data for health assessment
  static async getHealthAssessmentData(req, res) {
    try {
      const { days = 7, deviceId } = req.query;
      
      console.log(`🏥 Fetching data for health assessment (last ${days} days)...`);
      
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(days));
      
      const sensorReadingsRef = db.collection("sensor_readings");
      let query = sensorReadingsRef
        .where("timestamp", ">=", startDate)
        .where("timestamp", "<=", endDate)
        .orderBy("timestamp", "asc");
      
      if (deviceId) {
        query = query.where("device_id", "==", deviceId);
      }
      
      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "No data found for health assessment",
          data: []
        });
      }
      
      const healthData = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        healthData.push({
          id: doc.id,
          timestamp: data.timestamp,
          device_id: data.device_id,
          temperature: data.temperature,
          pH: data.pH,
          EC: data.EC,
          healthScore: MLController.calculateHealthScore(data)
        });
      });
      
      // Calculate overall health metrics
      const healthMetrics = MLController.calculateHealthMetrics(healthData);
      
      console.log(`✅ Retrieved ${healthData.length} records for health assessment`);
      
      res.status(200).json({
        success: true,
        message: "Health assessment data retrieved successfully",
        count: healthData.length,
        healthMetrics: healthMetrics,
        data: healthData
      });
      
    } catch (error) {
      console.error("❌ Error fetching health assessment data:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch health assessment data",
        error: error.message
      });
    }
  }

  // Helper function to group data by hour
  static groupDataByHour(data) {
    const grouped = {};
    
    data.forEach(item => {
      const date = new Date(item.timestamp);
      const hourKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}`;
      
      if (!grouped[hourKey]) {
        grouped[hourKey] = {
          timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()),
          device_id: item.device_id,
          temperature: [],
          pH: [],
          EC: []
        };
      }
      
      grouped[hourKey].temperature.push(item.temperature);
      grouped[hourKey].pH.push(item.pH);
      grouped[hourKey].EC.push(item.EC);
    });
    
    // Calculate averages for each hour
    return Object.values(grouped).map(group => ({
      timestamp: group.timestamp,
      device_id: group.device_id,
      temperature: group.temperature.reduce((a, b) => a + b, 0) / group.temperature.length,
      pH: group.pH.reduce((a, b) => a + b, 0) / group.pH.length,
      EC: group.EC.reduce((a, b) => a + b, 0) / group.EC.length
    }));
  }

  // Helper function to group data by day
  static groupDataByDay(data) {
    const grouped = {};
    
    data.forEach(item => {
      const date = new Date(item.timestamp);
      const dayKey = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          device_id: item.device_id,
          temperature: [],
          pH: [],
          EC: []
        };
      }
      
      grouped[dayKey].temperature.push(item.temperature);
      grouped[dayKey].pH.push(item.pH);
      grouped[dayKey].EC.push(item.EC);
    });
    
    // Calculate averages for each day
    return Object.values(grouped).map(group => ({
      timestamp: group.timestamp,
      device_id: group.device_id,
      temperature: group.temperature.reduce((a, b) => a + b, 0) / group.temperature.length,
      pH: group.pH.reduce((a, b) => a + b, 0) / group.pH.length,
      EC: group.EC.reduce((a, b) => a + b, 0) / group.EC.length
    }));
  }

  // Helper function to calculate health score
  static calculateHealthScore(data) {
    let score = 100;
    
    // Temperature scoring (optimal range: 20-30°C)
    if (data.temperature < 20 || data.temperature > 30) {
      score -= 20;
    } else if (data.temperature < 22 || data.temperature > 28) {
      score -= 10;
    }
    
    // pH scoring (optimal range: 6.5-7.5)
    if (data.pH < 6.0 || data.pH > 8.0) {
      score -= 25;
    } else if (data.pH < 6.5 || data.pH > 7.5) {
      score -= 15;
    }
    
    // EC scoring (optimal range: 1.0-2.0)
    if (data.EC < 0.5 || data.EC > 3.0) {
      score -= 20;
    } else if (data.EC < 1.0 || data.EC > 2.0) {
      score -= 10;
    }
    
    return Math.max(0, score);
  }

  // Helper function to calculate health metrics
  static calculateHealthMetrics(data) {
    if (data.length === 0) return null;
    
    const scores = data.map(item => item.healthScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    const healthStatus = avgScore >= 80 ? 'Excellent' : 
                        avgScore >= 60 ? 'Good' : 
                        avgScore >= 40 ? 'Fair' : 'Poor';
    
    return {
      averageHealthScore: Math.round(avgScore * 100) / 100,
      healthStatus: healthStatus,
      totalReadings: data.length,
      scoreDistribution: {
        excellent: scores.filter(s => s >= 80).length,
        good: scores.filter(s => s >= 60 && s < 80).length,
        fair: scores.filter(s => s >= 40 && s < 60).length,
        poor: scores.filter(s => s < 40).length
      }
    };
  }
}

module.exports = MLController;
