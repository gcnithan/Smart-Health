// controllers/userController.js
const userService = require('../services/userService');

class UserController {
  // POST /api/users - Create a new user
  async createUser(req, res) {
    try {
      const userData = req.body;
      
      const newUser = await userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // GET /api/users/:id - Get user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await userService.getUserById(id);
      
      res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: user
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

  // GET /api/users - Get all users with optional filters
  async getAllUsers(req, res) {
    try {
      const filters = {};
      
      // Extract query parameters
      if (req.query.district) filters.district = req.query.district;
      if (req.query.taluk) filters.taluk = req.query.taluk;
      if (req.query.village) filters.village = req.query.village;
      if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
      if (req.query.limit) filters.limit = parseInt(req.query.limit);
      
      const users = await userService.getAllUsers(filters);
      
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // PUT /api/users/:id - Update user by ID
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedUser = await userService.updateUser(id, updateData);
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
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

  // DELETE /api/users/:id - Delete user by ID
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const { hardDelete = false } = req.query;
      
      const result = await userService.deleteUser(id, hardDelete === 'true');
      
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

  // GET /api/users/search/:term - Search users by name
  async searchUsers(req, res) {
    try {
      const { term } = req.params;
      
      const users = await userService.searchUsersByName(term);
      
      res.status(200).json({
        success: true,
        message: 'Users search completed',
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // GET /api/users/location/:district - Get users by location
  async getUsersByLocation(req, res) {
    try {
      const { district } = req.params;
      const { taluk, village } = req.query;
      
      const users = await userService.getUsersByLocation(district, taluk, village);
      
      res.status(200).json({
        success: true,
        message: 'Users by location retrieved successfully',
        data: users,
        count: users.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }

  // PATCH /api/users/:id/activate - Activate user
  async activateUser(req, res) {
    try {
      const { id } = req.params;
      
      const updatedUser = await userService.updateUser(id, { isActive: true });
      
      res.status(200).json({
        success: true,
        message: 'User activated successfully',
        data: updatedUser
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

  // PATCH /api/users/:id/deactivate - Deactivate user
  async deactivateUser(req, res) {
    try {
      const { id } = req.params;
      
      const updatedUser = await userService.updateUser(id, { isActive: false });
      
      res.status(200).json({
        success: true,
        message: 'User deactivated successfully',
        data: updatedUser
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
}

module.exports = new UserController();