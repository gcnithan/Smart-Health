// controllers/hobliController.js
const hobliService = require('../services/hobliService');

class HobliController {
  // Create a new hobli
  async createHobli(req, res) {
    try {
      const hobliData = req.body;
      const result = await hobliService.createHobli(hobliData);
      
      res.status(201).json({
        success: true,
        message: 'Hobli created successfully',
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

  // Get all hoblis
  async getAllHoblis(req, res) {
    try {
      const filters = req.query;
      const hoblis = await hobliService.getAllHoblis(filters);
      
      res.status(200).json({
        success: true,
        message: 'Hoblis retrieved successfully',
        data: hoblis,
        count: hoblis.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Get hobli by ID
  async getHobliById(req, res) {
    try {
      const { id } = req.params;
      const { populate } = req.query;
      
      let hobli;
      if (populate === 'true') {
        hobli = await hobliService.getHobliByIdWithPopulate(id);
      } else {
        hobli = await hobliService.getHobliById(id);
      }
      
      res.status(200).json({
        success: true,
        message: 'Hobli retrieved successfully',
        data: hobli
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

  // Get hoblis by district
  async getHoblisByDistrict(req, res) {
    try {
      const { districtId } = req.params;
      const hoblis = await hobliService.getHoblisByDistrict(districtId);
      
      res.status(200).json({
        success: true,
        message: 'Hoblis retrieved successfully',
        data: hoblis,
        count: hoblis.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Get hoblis by taluk
  async getHoblisByTaluk(req, res) {
    try {
      const { talukId } = req.params;
      const hoblis = await hobliService.getHoblisByTaluk(talukId);
      
      res.status(200).json({
        success: true,
        message: 'Hoblis retrieved successfully',
        data: hoblis,
        count: hoblis.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Update hobli
  async updateHobli(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const result = await hobliService.updateHobli(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'Hobli updated successfully',
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

  // Delete hobli
  async deleteHobli(req, res) {
    try {
      const { id } = req.params;
      const result = await hobliService.deleteHobli(id);
      
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

  // Search hoblis
  async searchHoblis(req, res) {
    try {
      const { term } = req.params;
      const hoblis = await hobliService.searchHoblisByName(term);
      
      res.status(200).json({
        success: true,
        message: 'Hoblis search completed',
        data: hoblis,
        count: hoblis.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // Activate hobli
  async activateHobli(req, res) {
    try {
      const { id } = req.params;
      const result = await hobliService.activateHobli(id);
      
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

  // Deactivate hobli
  async deactivateHobli(req, res) {
    try {
      const { id } = req.params;
      const result = await hobliService.deactivateHobli(id);
      
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

  // Archive hobli
  async archiveHobli(req, res) {
    try {
      const { id } = req.params;
      const result = await hobliService.archiveHobli(id);
      
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

  // Get hobli statistics
  async getHobliStats(req, res) {
    try {
      const stats = await hobliService.getHobliStats();
      
      res.status(200).json({
        success: true,
        message: 'Hobli statistics retrieved successfully',
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

module.exports = new HobliController();
