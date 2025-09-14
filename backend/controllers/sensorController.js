const db = require("../config/config");

class SensorController {
  // Get all sensor readings
  static async getAllReadings(req, res) {
    try {
      console.log("📡 Fetching all sensor readings from Firestore...");
      
      const sensorReadingsRef = db.collection("sensor_readings");
      const snapshot = await sensorReadingsRef.orderBy("timestamp", "desc").get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "No sensor readings found",
          data: []
        });
      }
      
      const readings = [];
      snapshot.forEach(doc => {
        readings.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ Retrieved ${readings.length} sensor readings`);
      
      res.status(200).json({
        success: true,
        message: "Sensor readings retrieved successfully",
        count: readings.length,
        data: readings
      });
      
    } catch (error) {
      console.error("❌ Error fetching sensor readings:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch sensor readings",
        error: error.message
      });
    }
  }

  // Get latest sensor reading
  static async getLatestReading(req, res) {
    try {
      console.log("📡 Fetching latest sensor reading...");
      
      const sensorReadingsRef = db.collection("sensor_readings");
      const snapshot = await sensorReadingsRef.orderBy("timestamp", "desc").limit(1).get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "No sensor readings found",
          data: null
        });
      }
      
      const latestReading = snapshot.docs[0];
      const readingData = {
        id: latestReading.id,
        ...latestReading.data()
      };
      
      console.log("✅ Retrieved latest sensor reading:", readingData.id);
      
      res.status(200).json({
        success: true,
        message: "Latest sensor reading retrieved successfully",
        data: readingData
      });
      
    } catch (error) {
      console.error("❌ Error fetching latest sensor reading:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch latest sensor reading",
        error: error.message
      });
    }
  }

  // Get sensor readings by date range
  static async getReadingsByDateRange(req, res) {
    try {
      const { startDate, endDate, deviceId } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Start date and end date are required"
        });
      }
      
      console.log(`📡 Fetching sensor readings from ${startDate} to ${endDate}${deviceId ? ` for device ${deviceId}` : ''}...`);
      
      const sensorReadingsRef = db.collection("sensor_readings");
      let query = sensorReadingsRef
        .where("timestamp", ">=", new Date(startDate))
        .where("timestamp", "<=", new Date(endDate))
        .orderBy("timestamp", "desc");
      
      if (deviceId) {
        query = query.where("device_id", "==", deviceId);
      }
      
      const snapshot = await query.get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "No sensor readings found for the specified date range",
          data: []
        });
      }
      
      const readings = [];
      snapshot.forEach(doc => {
        readings.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ Retrieved ${readings.length} sensor readings for date range`);
      
      res.status(200).json({
        success: true,
        message: "Sensor readings retrieved successfully",
        count: readings.length,
        data: readings
      });
      
    } catch (error) {
      console.error("❌ Error fetching sensor readings by date range:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch sensor readings",
        error: error.message
      });
    }
  }

  // Get sensor readings by device ID
  static async getReadingsByDevice(req, res) {
    try {
      const { deviceId } = req.params;
      const { limit = 10 } = req.query;
      
      console.log(`📡 Fetching sensor readings for device: ${deviceId}...`);
      
      const sensorReadingsRef = db.collection("sensor_readings");
      const snapshot = await sensorReadingsRef
        .where("device_id", "==", deviceId)
        .orderBy("timestamp", "desc")
        .limit(parseInt(limit))
        .get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: `No sensor readings found for device: ${deviceId}`,
          data: []
        });
      }
      
      const readings = [];
      snapshot.forEach(doc => {
        readings.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`✅ Retrieved ${readings.length} sensor readings for device ${deviceId}`);
      
      res.status(200).json({
        success: true,
        message: "Sensor readings retrieved successfully",
        count: readings.length,
        data: readings
      });
      
    } catch (error) {
      console.error("❌ Error fetching sensor readings by device:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch sensor readings",
        error: error.message
      });
    }
  }

  // Get sensor statistics
  static async getSensorStatistics(req, res) {
    try {
      console.log("📊 Calculating sensor statistics...");
      
      const sensorReadingsRef = db.collection("sensor_readings");
      const snapshot = await sensorReadingsRef.get();
      
      if (snapshot.empty) {
        return res.status(404).json({
          success: false,
          message: "No sensor readings found for statistics",
          data: null
        });
      }
      
      const readings = [];
      snapshot.forEach(doc => {
        readings.push(doc.data());
      });
      
      // Calculate statistics
      const stats = {
        totalReadings: readings.length,
        devices: [...new Set(readings.map(r => r.device_id))],
        dateRange: {
          earliest: new Date(Math.min(...readings.map(r => new Date(r.timestamp)))),
          latest: new Date(Math.max(...readings.map(r => new Date(r.timestamp))))
        },
        averages: {
          temperature: readings.reduce((sum, r) => sum + r.temperature, 0) / readings.length,
          pH: readings.reduce((sum, r) => sum + r.pH, 0) / readings.length,
          EC: readings.reduce((sum, r) => sum + r.EC, 0) / readings.length
        },
        ranges: {
          temperature: {
            min: Math.min(...readings.map(r => r.temperature)),
            max: Math.max(...readings.map(r => r.temperature))
          },
          pH: {
            min: Math.min(...readings.map(r => r.pH)),
            max: Math.max(...readings.map(r => r.pH))
          },
          EC: {
            min: Math.min(...readings.map(r => r.EC)),
            max: Math.max(...readings.map(r => r.EC))
          }
        }
      };
      
      console.log("✅ Calculated sensor statistics");
      
      res.status(200).json({
        success: true,
        message: "Sensor statistics calculated successfully",
        data: stats
      });
      
    } catch (error) {
      console.error("❌ Error calculating sensor statistics:", error);
      res.status(500).json({
        success: false,
        message: "Failed to calculate sensor statistics",
        error: error.message
      });
    }
  }

  // Add new sensor reading
  static async addSensorReading(req, res) {
    try {
      const { temperature, pH, EC, device_id } = req.body;
      
      // Validate required fields
      if (!temperature || !pH || !EC || !device_id) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields: temperature, pH, EC, device_id"
        });
      }
      
      console.log(`📝 Adding new sensor reading for device: ${device_id}...`);
      
      const sensorReading = {
        temperature: parseFloat(temperature),
        pH: parseFloat(pH),
        EC: parseFloat(EC),
        timestamp: new Date(),
        device_id: device_id
      };
      
      const sensorReadingsRef = db.collection("sensor_readings");
      const docRef = await sensorReadingsRef.add(sensorReading);
      
      console.log(`✅ Added sensor reading with ID: ${docRef.id}`);
      
      res.status(201).json({
        success: true,
        message: "Sensor reading added successfully",
        data: {
          id: docRef.id,
          ...sensorReading
        }
      });
      
    } catch (error) {
      console.error("❌ Error adding sensor reading:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add sensor reading",
        error: error.message
      });
    }
  }

  // Update sensor reading
  static async updateSensorReading(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log(`📝 Updating sensor reading: ${id}...`);
      
      const sensorReadingsRef = db.collection("sensor_readings");
      const docRef = sensorReadingsRef.doc(id);
      
      // Check if document exists
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: "Sensor reading not found"
        });
      }
      
      // Update the document
      await docRef.update({
        ...updateData,
        updatedAt: new Date()
      });
      
      // Get updated document
      const updatedDoc = await docRef.get();
      
      console.log(`✅ Updated sensor reading: ${id}`);
      
      res.status(200).json({
        success: true,
        message: "Sensor reading updated successfully",
        data: {
          id: updatedDoc.id,
          ...updatedDoc.data()
        }
      });
      
    } catch (error) {
      console.error("❌ Error updating sensor reading:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update sensor reading",
        error: error.message
      });
    }
  }

  // Delete sensor reading
  static async deleteSensorReading(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`🗑️ Deleting sensor reading: ${id}...`);
      
      const sensorReadingsRef = db.collection("sensor_readings");
      const docRef = sensorReadingsRef.doc(id);
      
      // Check if document exists
      const doc = await docRef.get();
      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          message: "Sensor reading not found"
        });
      }
      
      // Delete the document
      await docRef.delete();
      
      console.log(`✅ Deleted sensor reading: ${id}`);
      
      res.status(200).json({
        success: true,
        message: "Sensor reading deleted successfully"
      });
      
    } catch (error) {
      console.error("❌ Error deleting sensor reading:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete sensor reading",
        error: error.message
      });
    }
  }
}

module.exports = SensorController;
