// controllers/talukController.js
const talukService = require('../services/talukService');

class TalukController {
  // Create a new taluk
  async createTaluk(req, res) {
    try {
      const talukData = req.body;
      const result = await talukService.createTaluk(talukData);
      
      res.status(201).json({
        success: true,
        message: 'Taluk created successfully',
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

  // Get all taluks
  async getAllTaluks(req, res) {
    try {
      const filters = req.query;
      const taluks = await talukService.getAllTaluks(filters);
      
      res.status(200).json({
        success: true,
        message: 'Taluks retrieved successfully',
        data: taluks,
        count: taluks.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Get taluk by ID
  async getTalukById(req, res) {
    try {
      const { id } = req.params;
      const { populate } = req.query;
      
      let taluk;
      if (populate === 'true') {
        taluk = await talukService.getTalukByIdWithPopulate(id);
      } else {
        taluk = await talukService.getTalukById(id);
      }
      
      res.status(200).json({
        success: true,
        message: 'Taluk retrieved successfully',
        data: taluk
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

  // Get taluks by district
  async getTaluksByDistrict(req, res) {
    try {
      const { districtId } = req.params;
      const taluks = await talukService.getTaluksByDistrict(districtId);
      
      res.status(200).json({
        success: true,
        message: 'Taluks retrieved successfully',
        data: taluks,
        count: taluks.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Update taluk
  async updateTaluk(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await talukService.updateTaluk(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Taluk updated successfully',
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

  // Delete taluk
  async deleteTaluk(req, res) {
    try {
      const { id } = req.params;
      const result = await talukService.deleteTaluk(id);
      
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

  // Search taluks
  async searchTaluks(req, res) {
    try {
      const { term } = req.params;
      const taluks = await talukService.searchTaluksByName(term);
      
      res.status(200).json({
        success: true,
        message: 'Taluks search completed',
        data: taluks,
        count: taluks.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Activate taluk
  async activateTaluk(req, res) {
    try {
      const { id } = req.params;
      const result = await talukService.activateTaluk(id);
      
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

  // Deactivate taluk
  async deactivateTaluk(req, res) {
    try {
      const { id } = req.params;
      const result = await talukService.deactivateTaluk(id);
      
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

  // Archive taluk
  async archiveTaluk(req, res) {
    try {
      const { id } = req.params;
      const result = await talukService.archiveTaluk(id);
      
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

  // Get taluk statistics
  async getTalukStats(req, res) {
    try {
      const stats = await talukService.getTalukStats();
      
      res.status(200).json({
        success: true,
        message: 'Taluk statistics retrieved successfully',
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

module.exports = new TalukController();
