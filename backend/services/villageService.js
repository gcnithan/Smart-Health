// services/villageService.js
const db = require('../config/config');
const Village = require('../models/village/village');

class VillageService {
  constructor() {
    this.collectionName = 'villages';
  }

  // Create a new village
  async createVillage(villageData) {
    try {
      const village = new Village(villageData);
      const validation = village.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      village.createdAt = new Date();
      village.updatedAt = new Date();
      
      const docRef = await db.collection(this.collectionName).add(village.toFirestore());
      
      return {
        id: docRef.id,
        ...village.toFirestore()
      };
    } catch (error) {
      throw new Error(`Failed to create village: ${error.message}`);
    }
  }

  // Get village by ID
  async getVillageById(villageId) {
    try {
      const villageDoc = await db.collection(this.collectionName).doc(villageId).get();
      
      if (!villageDoc.exists) {
        throw new Error('Village not found');
      }
      
      return {
        id: villageDoc.id,
        ...villageDoc.data()
      };
    } catch (error) {
      throw new Error(`Failed to get village: ${error.message}`);
    }
  }

  // Get village by ID with populated references
  async getVillageByIdWithPopulate(villageId) {
    try {
      const villageDoc = await db.collection(this.collectionName).doc(villageId).get();
      
      if (!villageDoc.exists) {
        throw new Error('Village not found');
      }
      
      return await Village.fromFirestoreWithPopulate(villageDoc);
    } catch (error) {
      throw new Error(`Failed to get village with populate: ${error.message}`);
    }
  }

  // Get all villages with optional filters
  async getAllVillages(filters = {}) {
    try {
      let query = db.collection(this.collectionName);
      
      // Apply filters
      if (filters.district) {
        query = query.where('district', '==', filters.district);
      }
      
      if (filters.taluk) {
        query = query.where('taluk', '==', filters.taluk);
      }
      
      if (filters.hobli) {
        query = query.where('hobli', '==', filters.hobli);
      }
      
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
      const villages = [];
      
      querySnapshot.forEach((doc) => {
        villages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return villages;
    } catch (error) {
      throw new Error(`Failed to get villages: ${error.message}`);
    }
  }

  // Get villages by district
  async getVillagesByDistrict(districtId) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('district', '==', districtId)
        .where('is_active', '==', true)
        .orderBy('name', 'asc')
        .get();
      
      const villages = [];
      querySnapshot.forEach((doc) => {
        villages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return villages;
    } catch (error) {
      throw new Error(`Failed to get villages by district: ${error.message}`);
    }
  }

  // Get villages by taluk
  async getVillagesByTaluk(talukId) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('taluk', '==', talukId)
        .where('is_active', '==', true)
        .orderBy('name', 'asc')
        .get();
      
      const villages = [];
      querySnapshot.forEach((doc) => {
        villages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return villages;
    } catch (error) {
      throw new Error(`Failed to get villages by taluk: ${error.message}`);
    }
  }

  // Get villages by hobli
  async getVillagesByHobli(hobliId) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('hobli', '==', hobliId)
        .where('is_active', '==', true)
        .orderBy('name', 'asc')
        .get();
      
      const villages = [];
      querySnapshot.forEach((doc) => {
        villages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return villages;
    } catch (error) {
      throw new Error(`Failed to get villages by hobli: ${error.message}`);
    }
  }

  // Get village by code
  async getVillageByCode(villageCode) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('village_code', '==', villageCode)
        .limit(1)
        .get();
      
      if (querySnapshot.empty) {
        throw new Error('Village not found');
      }
      
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      throw new Error(`Failed to get village by code: ${error.message}`);
    }
  }

  // Update village by ID
  async updateVillage(villageId, updateData) {
    try {
      const villageRef = db.collection(this.collectionName).doc(villageId);
      const villageDoc = await villageRef.get();
      
      if (!villageDoc.exists) {
        throw new Error('Village not found');
      }

      // Validate update data
      const village = new Village({ ...villageDoc.data(), ...updateData });
      const validation = village.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      updateData.updatedAt = new Date();
      
      await villageRef.update(updateData);
      
      return {
        id: villageId,
        ...villageDoc.data(),
        ...updateData
      };
    } catch (error) {
      throw new Error(`Failed to update village: ${error.message}`);
    }
  }

  // Delete village by ID
  async deleteVillage(villageId) {
    try {
      const villageRef = db.collection(this.collectionName).doc(villageId);
      const villageDoc = await villageRef.get();
      
      if (!villageDoc.exists) {
        throw new Error('Village not found');
      }

      await villageRef.delete();
      
      return { message: 'Village deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete village: ${error.message}`);
    }
  }

  // Search villages by name
  async searchVillagesByName(searchTerm) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('name', '>=', searchTerm)
        .where('name', '<=', searchTerm + '\uf8ff')
        .get();
      
      const villages = [];
      querySnapshot.forEach((doc) => {
        villages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return villages;
    } catch (error) {
      throw new Error(`Failed to search villages: ${error.message}`);
    }
  }

  // Activate village
  async activateVillage(villageId) {
    try {
      const villageRef = db.collection(this.collectionName).doc(villageId);
      const villageDoc = await villageRef.get();
      
      if (!villageDoc.exists) {
        throw new Error('Village not found');
      }

      await villageRef.update({
        is_active: true,
        updatedAt: new Date()
      });
      
      return { message: 'Village activated successfully' };
    } catch (error) {
      throw new Error(`Failed to activate village: ${error.message}`);
    }
  }

  // Deactivate village
  async deactivateVillage(villageId) {
    try {
      const villageRef = db.collection(this.collectionName).doc(villageId);
      const villageDoc = await villageRef.get();
      
      if (!villageDoc.exists) {
        throw new Error('Village not found');
      }

      await villageRef.update({
        is_active: false,
        updatedAt: new Date()
      });
      
      return { message: 'Village deactivated successfully' };
    } catch (error) {
      throw new Error(`Failed to deactivate village: ${error.message}`);
    }
  }

  // Archive village
  async archiveVillage(villageId) {
    try {
      const villageRef = db.collection(this.collectionName).doc(villageId);
      const villageDoc = await villageRef.get();
      
      if (!villageDoc.exists) {
        throw new Error('Village not found');
      }

      await villageRef.update({
        is_archived: true,
        updatedAt: new Date()
      });
      
      return { message: 'Village archived successfully' };
    } catch (error) {
      throw new Error(`Failed to archive village: ${error.message}`);
    }
  }

  // Get village statistics
  async getVillageStats() {
    try {
      const querySnapshot = await db.collection(this.collectionName).get();
      
      let totalVillages = 0;
      let activeVillages = 0;
      let archivedVillages = 0;
      const districtStats = {};
      const talukStats = {};
      const hobliStats = {};
      
      querySnapshot.forEach((doc) => {
        const villageData = doc.data();
        totalVillages++;
        
        if (villageData.is_active) {
          activeVillages++;
        }
        
        if (villageData.is_archived) {
          archivedVillages++;
        }
        
        if (villageData.district) {
          districtStats[villageData.district] = (districtStats[villageData.district] || 0) + 1;
        }
        
        if (villageData.taluk) {
          talukStats[villageData.taluk] = (talukStats[villageData.taluk] || 0) + 1;
        }
        
        if (villageData.hobli) {
          hobliStats[villageData.hobli] = (hobliStats[villageData.hobli] || 0) + 1;
        }
      });
      
      return {
        totalVillages,
        activeVillages,
        archivedVillages,
        districtStats,
        talukStats,
        hobliStats
      };
    } catch (error) {
      throw new Error(`Failed to get village statistics: ${error.message}`);
    }
  }
}

module.exports = new VillageService();
