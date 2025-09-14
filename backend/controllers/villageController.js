// controllers/villageController.js
const villageService = require('../services/villageService');

class VillageController {
  // Create a new village
  async createVillage(req, res) {
    try {
      const villageData = req.body;
      const result = await villageService.createVillage(villageData);
      
      res.status(201).json({
        success: true,
        message: 'Village created successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Get all villages
  async getAllVillages(req, res) {
    try {
      const filters = req.query;
      const villages = await villageService.getAllVillages(filters);
      
      res.status(200).json({
        success: true,
        message: 'Villages retrieved successfully',
        data: villages,
        count: villages.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Get village by ID
  async getVillageById(req, res) {
    try {
      const { id } = req.params;
      const { populate } = req.query;
      
      let village;
      if (populate === 'true') {
        village = await villageService.getVillageByIdWithPopulate(id);
      } else {
        village = await villageService.getVillageById(id);
      }
      
      res.status(200).json({
        success: true,
        message: 'Village retrieved successfully',
        data: village
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Get village by code
  async getVillageByCode(req, res) {
    try {
      const { code } = req.params;
      const village = await villageService.getVillageByCode(code);
      
      res.status(200).json({
        success: true,
        message: 'Village retrieved successfully',
        data: village
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Get villages by district
  async getVillagesByDistrict(req, res) {
    try {
      const { districtId } = req.params;
      const villages = await villageService.getVillagesByDistrict(districtId);
      
      res.status(200).json({
        success: true,
        message: 'Villages retrieved successfully',
        data: villages,
        count: villages.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Get villages by taluk
  async getVillagesByTaluk(req, res) {
    try {
      const { talukId } = req.params;
      const villages = await villageService.getVillagesByTaluk(talukId);
      
      res.status(200).json({
        success: true,
        message: 'Villages retrieved successfully',
        data: villages,
        count: villages.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Get villages by hobli
  async getVillagesByHobli(req, res) {
    try {
      const { hobliId } = req.params;
      const villages = await villageService.getVillagesByHobli(hobliId);
      
      res.status(200).json({
        success: true,
        message: 'Villages retrieved successfully',
        data: villages,
        count: villages.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Update village
  async updateVillage(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await villageService.updateVillage(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Village updated successfully',
        data: result
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Delete village
  async deleteVillage(req, res) {
    try {
      const { id } = req.params;
      const result = await villageService.deleteVillage(id);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: null
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Search villages
  async searchVillages(req, res) {
    try {
      const { term } = req.params;
      const villages = await villageService.searchVillagesByName(term);
      
      res.status(200).json({
        success: true,
        message: 'Villages search completed',
        data: villages,
        count: villages.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Activate village
  async activateVillage(req, res) {
    try {
      const { id } = req.params;
      const result = await villageService.activateVillage(id);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: null
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Deactivate village
  async deactivateVillage(req, res) {
    try {
      const { id } = req.params;
      const result = await villageService.deactivateVillage(id);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: null
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Archive village
  async archiveVillage(req, res) {
    try {
      const { id } = req.params;
      const result = await villageService.archiveVillage(id);
      
      res.status(200).json({
        success: true,
        message: result.message,
        data: null
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Get village statistics
  async getVillageStats(req, res) {
    try {
      const stats = await villageService.getVillageStats();
      
      res.status(200).json({
        success: true,
        message: 'Village statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }
}

module.exports = new VillageController();
