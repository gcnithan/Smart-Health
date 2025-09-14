// services/districtService.js
const db = require('../config/config');
const District = require('../models/district/district');

class DistrictService {
  constructor() {
    this.collectionName = 'districts';
  }

  // Create a new district
  async createDistrict(districtData) {
    try {
      const district = new District(districtData);
      const validation = district.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      district.createdAt = new Date();
      district.updatedAt = new Date();
      
      const docRef = await db.collection(this.collectionName).add(district.toFirestore());
      
      return {
        id: docRef.id,
        ...district.toFirestore()
      };
    } catch (error) {
      throw new Error(`Failed to create district: ${error.message}`);
    }
  }

  // Get district by ID
  async getDistrictById(districtId) {
    try {
      const districtDoc = await db.collection(this.collectionName).doc(districtId).get();
      
      if (!districtDoc.exists) {
        throw new Error('District not found');
      }
      
      return {
        id: districtDoc.id,
        ...districtDoc.data()
      };
    } catch (error) {
      throw new Error(`Failed to get district: ${error.message}`);
    }
  }

  // Get all districts with optional filters
  async getAllDistricts(filters = {}) {
    try {
      let query = db.collection(this.collectionName);
      
      // Apply filters
      if (filters.is_active !== undefined) {
        query = query.where('is_active', '==', filters.is_active);
      }
      
      if (filters.is_archived !== undefined) {
        query = query.where('is_archived', '==', filters.is_archived);
      }
      
      // Add ordering
      query = query.orderBy('name', 'asc');
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      const querySnapshot = await query.get();
      const districts = [];
      
      querySnapshot.forEach((doc) => {
        districts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return districts;
    } catch (error) {
      throw new Error(`Failed to get districts: ${error.message}`);
    }
  }

  // Update district by ID
  async updateDistrict(districtId, updateData) {
    try {
      const districtRef = db.collection(this.collectionName).doc(districtId);
      const districtDoc = await districtRef.get();
      
      if (!districtDoc.exists) {
        throw new Error('District not found');
      }

      // Validate update data
      const district = new District({ ...districtDoc.data(), ...updateData });
      const validation = district.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      updateData.updatedAt = new Date();
      
      await districtRef.update(updateData);
      
      return {
        id: districtId,
        ...districtDoc.data(),
        ...updateData
      };
    } catch (error) {
      throw new Error(`Failed to update district: ${error.message}`);
    }
  }

  // Delete district by ID
  async deleteDistrict(districtId) {
    try {
      const districtRef = db.collection(this.collectionName).doc(districtId);
      const districtDoc = await districtRef.get();
      
      if (!districtDoc.exists) {
        throw new Error('District not found');
      }

      await districtRef.delete();
      
      return { message: 'District deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete district: ${error.message}`);
    }
  }

  // Search districts by name
  async searchDistrictsByName(searchTerm) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('name', '>=', searchTerm)
        .where('name', '<=', searchTerm + '\uf8ff')
        .get();
      
      const districts = [];
      querySnapshot.forEach((doc) => {
        districts.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return districts;
    } catch (error) {
      throw new Error(`Failed to search districts: ${error.message}`);
    }
  }

  // Activate district
  async activateDistrict(districtId) {
    try {
      const districtRef = db.collection(this.collectionName).doc(districtId);
      const districtDoc = await districtRef.get();
      
      if (!districtDoc.exists) {
        throw new Error('District not found');
      }

      await districtRef.update({
        is_active: true,
        updatedAt: new Date()
      });
      
      return { message: 'District activated successfully' };
    } catch (error) {
      throw new Error(`Failed to activate district: ${error.message}`);
    }
  }

  // Deactivate district
  async deactivateDistrict(districtId) {
    try {
      const districtRef = db.collection(this.collectionName).doc(districtId);
      const districtDoc = await districtRef.get();
      
      if (!districtDoc.exists) {
        throw new Error('District not found');
      }

      await districtRef.update({
        is_active: false,
        updatedAt: new Date()
      });
      
      return { message: 'District deactivated successfully' };
    } catch (error) {
      throw new Error(`Failed to deactivate district: ${error.message}`);
    }
  }

  // Archive district
  async archiveDistrict(districtId) {
    try {
      const districtRef = db.collection(this.collectionName).doc(districtId);
      const districtDoc = await districtRef.get();
      
      if (!districtDoc.exists) {
        throw new Error('District not found');
      }

      await districtRef.update({
        is_archived: true,
        updatedAt: new Date()
      });
      
      return { message: 'District archived successfully' };
    } catch (error) {
      throw new Error(`Failed to archive district: ${error.message}`);
    }
  }

  // Get district statistics
  async getDistrictStats() {
    try {
      const querySnapshot = await db.collection(this.collectionName).get();
      
      let totalDistricts = 0;
      let activeDistricts = 0;
      let archivedDistricts = 0;
      
      querySnapshot.forEach((doc) => {
        const districtData = doc.data();
        totalDistricts++;
        
        if (districtData.is_active) {
          activeDistricts++;
        }
        
        if (districtData.is_archived) {
          archivedDistricts++;
        }
      });
      
      return {
        totalDistricts,
        activeDistricts,
        archivedDistricts
      };
    } catch (error) {
      throw new Error(`Failed to get district statistics: ${error.message}`);
    }
  }
}

module.exports = new DistrictService();
