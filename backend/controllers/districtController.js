// controllers/districtController.js
const districtService = require('../services/districtService');

class DistrictController {
  // Create a new district
  async createDistrict(req, res) {
    try {
      const districtData = req.body;
      const result = await districtService.createDistrict(districtData);
      
      res.status(201).json({
        success: true,
        message: 'District created successfully',
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

  // Get all districts
  async getAllDistricts(req, res) {
    try {
      const filters = req.query;
      const districts = await districtService.getAllDistricts(filters);
      
      res.status(200).json({
        success: true,
        message: 'Districts retrieved successfully',
        data: districts,
        count: districts.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Get district by ID
  async getDistrictById(req, res) {
    try {
      const { id } = req.params;
      const district = await districtService.getDistrictById(id);
      
      res.status(200).json({
        success: true,
        message: 'District retrieved successfully',
        data: district
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

  // Update district
  async updateDistrict(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await districtService.updateDistrict(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'District updated successfully',
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

  // Delete district
  async deleteDistrict(req, res) {
    try {
      const { id } = req.params;
      const result = await districtService.deleteDistrict(id);
      
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

  // Search districts
  async searchDistricts(req, res) {
    try {
      const { term } = req.params;
      const districts = await districtService.searchDistrictsByName(term);
      
      res.status(200).json({
        success: true,
        message: 'Districts search completed',
        data: districts,
        count: districts.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Activate district
  async activateDistrict(req, res) {
    try {
      const { id } = req.params;
      const result = await districtService.activateDistrict(id);
      
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

  // Deactivate district
  async deactivateDistrict(req, res) {
    try {
      const { id } = req.params;
      const result = await districtService.deactivateDistrict(id);
      
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

  // Archive district
  async archiveDistrict(req, res) {
    try {
      const { id } = req.params;
      const result = await districtService.archiveDistrict(id);
      
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

  // Get district statistics
  async getDistrictStats(req, res) {
    try {
      const stats = await districtService.getDistrictStats();
      
      res.status(200).json({
        success: true,
        message: 'District statistics retrieved successfully',
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

module.exports = new DistrictController();
