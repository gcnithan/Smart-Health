// services/userService.js
const db = require('../config/config');
const User = require('../models/users/user');

class UserService {
  constructor() {
    this.collectionName = 'users';
  }

  // Create a new user
  async createUser(userData) {
    try {
      const user = new User(userData);
      const validation = user.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      user.createdAt = new Date();
      user.updatedAt = new Date();
      
      const docRef = await db.collection(this.collectionName).add(user.toFirestore());
      
      return {
        id: docRef.id,
        ...user.toFirestore()
      };
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const userDoc = await db.collection(this.collectionName).doc(userId).get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }
      
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Get all users with optional filters
  async getAllUsers(filters = {}) {
    try {
      let query = db.collection(this.collectionName);
      
      // Apply filters
      if (filters.district) {
        query = query.where('district', '==', filters.district);
      }
      
      if (filters.taluk) {
        query = query.where('taluk', '==', filters.taluk);
      }
      
      if (filters.village) {
        query = query.where('village', '==', filters.village);
      }
      
      if (filters.isActive !== undefined) {
        query = query.where('isActive', '==', filters.isActive);
      }
      
      // Add ordering and limit
      query = query.orderBy('createdAt', 'desc');
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      const querySnapshot = await query.get();
      const users = [];
      
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return users;
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  // Update user by ID
  async updateUser(userId, updateData) {
    try {
      const userRef = db.collection(this.collectionName).doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      // Validate update data
      const user = new User({ ...userDoc.data(), ...updateData });
      const validation = user.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      updateData.updatedAt = new Date();
      
      await userRef.update(updateData);
      
      return {
        id: userId,
        ...userDoc.data(),
        ...updateData
      };
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Delete user by ID
  async deleteUser(userId) {
    try {
      const userRef = db.collection(this.collectionName).doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      await userRef.delete();
      
      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Search users by term
  async searchUsersByName(searchTerm) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('name', '>=', searchTerm)
        .where('name', '<=', searchTerm + '\uf8ff')
        .get();
      
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return users;
    } catch (error) {
      throw new Error(`Failed to search users: ${error.message}`);
    }
  }

  // Get users by location
  async getUsersByLocation(district) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('district', '==', district)
        .get();
      
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return users;
    } catch (error) {
      throw new Error(`Failed to get users by location: ${error.message}`);
    }
  }

  // Activate user
  async activateUser(userId) {
    try {
      const userRef = db.collection(this.collectionName).doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      await userRef.update({
        isActive: true,
        updatedAt: new Date()
      });
      
      return { message: 'User activated successfully' };
    } catch (error) {
      throw new Error(`Failed to activate user: ${error.message}`);
    }
  }

  // Deactivate user
  async deactivateUser(userId) {
    try {
      const userRef = db.collection(this.collectionName).doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      await userRef.update({
        isActive: false,
        updatedAt: new Date()
      });
      
      return { message: 'User deactivated successfully' };
    } catch (error) {
      throw new Error(`Failed to deactivate user: ${error.message}`);
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const querySnapshot = await db.collection(this.collectionName).get();
      
      let totalUsers = 0;
      let activeUsers = 0;
      let inactiveUsers = 0;
      const districtStats = {};
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        totalUsers++;
        
        if (userData.isActive) {
          activeUsers++;
        } else {
          inactiveUsers++;
        }
        
        if (userData.district) {
          districtStats[userData.district] = (districtStats[userData.district] || 0) + 1;
        }
      });
      
      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        districtStats
      };
    } catch (error) {
      throw new Error(`Failed to get user statistics: ${error.message}`);
    }
  }
}

module.exports = new UserService();