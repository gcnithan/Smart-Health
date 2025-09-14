const express = require("express");
const SensorController = require("../controllers/sensorController");
const router = express.Router();

// Sensor Routes
// GET /api/sensors - Get all sensor readings
router.get("/", SensorController.getAllReadings);

// GET /api/sensors/latest - Get latest sensor reading
router.get("/latest", SensorController.getLatestReading);

// GET /api/sensors/range - Get sensor readings by date range
router.get("/range", SensorController.getReadingsByDateRange);

// GET /api/sensors/device/:deviceId - Get sensor readings by device ID
router.get("/device/:deviceId", SensorController.getReadingsByDevice);

// GET /api/sensors/stats - Get sensor statistics
router.get("/stats", SensorController.getSensorStatistics);

// POST /api/sensors - Add new sensor reading
router.post("/", SensorController.addSensorReading);

// PUT /api/sensors/:id - Update sensor reading
router.put("/:id", SensorController.updateSensorReading);

// DELETE /api/sensors/:id - Delete sensor reading
router.delete("/:id", SensorController.deleteSensorReading);

module.exports = router;
