// services/talukService.js
const db = require('../config/config');
const Taluk = require('../models/taluk/taluk');

class TalukService {
  constructor() {
    this.collectionName = 'taluks';
  }

  // Create a new taluk
  async createTaluk(talukData) {
    try {
      const taluk = new Taluk(talukData);
      const validation = taluk.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      taluk.createdAt = new Date();
      taluk.updatedAt = new Date();
      
      const docRef = await db.collection(this.collectionName).add(taluk.toFirestore());
      
      return {
        id: docRef.id,
        ...taluk.toFirestore()
      };
    } catch (error) {
      throw new Error(`Failed to create taluk: ${error.message}`);
    }
  }

  // Get taluk by ID
  async getTalukById(talukId) {
    try {
      const talukDoc = await db.collection(this.collectionName).doc(talukId).get();
      
      if (!talukDoc.exists) {
        throw new Error('Taluk not found');
      }
      
      return {
        id: talukDoc.id,
        ...talukDoc.data()
      };
    } catch (error) {
      throw new Error(`Failed to get taluk: ${error.message}`);
    }
  }

  // Get taluk by ID with populated references
  async getTalukByIdWithPopulate(talukId) {
    try {
      const talukDoc = await db.collection(this.collectionName).doc(talukId).get();
      
      if (!talukDoc.exists) {
        throw new Error('Taluk not found');
      }
      
      return await Taluk.fromFirestoreWithPopulate(talukDoc);
    } catch (error) {
      throw new Error(`Failed to get taluk with populate: ${error.message}`);
    }
  }

  // Get all taluks with optional filters
  async getAllTaluks(filters = {}) {
    try {
      let query = db.collection(this.collectionName);
      
      // Apply filters
      if (filters.district) {
        query = query.where('district', '==', filters.district);
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
      const taluks = [];
      
      querySnapshot.forEach((doc) => {
        taluks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return taluks;
    } catch (error) {
      throw new Error(`Failed to get taluks: ${error.message}`);
    }
  }

  // Get taluks by district
  async getTaluksByDistrict(districtId) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('district', '==', districtId)
        .where('is_active', '==', true)
        .orderBy('name', 'asc')
        .get();
      
      const taluks = [];
      querySnapshot.forEach((doc) => {
        taluks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return taluks;
    } catch (error) {
      throw new Error(`Failed to get taluks by district: ${error.message}`);
    }
  }

  // Update taluk by ID
  async updateTaluk(talukId, updateData) {
    try {
      const talukRef = db.collection(this.collectionName).doc(talukId);
      const talukDoc = await talukRef.get();
      
      if (!talukDoc.exists) {
        throw new Error('Taluk not found');
      }

      // Validate update data
      const taluk = new Taluk({ ...talukDoc.data(), ...updateData });
      const validation = taluk.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      updateData.updatedAt = new Date();
      
      await talukRef.update(updateData);
      
      return {
        id: talukId,
        ...talukDoc.data(),
        ...updateData
      };
    } catch (error) {
      throw new Error(`Failed to update taluk: ${error.message}`);
    }
  }

  // Delete taluk by ID
  async deleteTaluk(talukId) {
    try {
      const talukRef = db.collection(this.collectionName).doc(talukId);
      const talukDoc = await talukRef.get();
      
      if (!talukDoc.exists) {
        throw new Error('Taluk not found');
      }

      await talukRef.delete();
      
      return { message: 'Taluk deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete taluk: ${error.message}`);
    }
  }

  // Search taluks by name
  async searchTaluksByName(searchTerm) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('name', '>=', searchTerm)
        .where('name', '<=', searchTerm + '\uf8ff')
        .get();
      
      const taluks = [];
      querySnapshot.forEach((doc) => {
        taluks.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return taluks;
    } catch (error) {
      throw new Error(`Failed to search taluks: ${error.message}`);
    }
  }

  // Activate taluk
  async activateTaluk(talukId) {
    try {
      const talukRef = db.collection(this.collectionName).doc(talukId);
      const talukDoc = await talukRef.get();
      
      if (!talukDoc.exists) {
        throw new Error('Taluk not found');
      }

      await talukRef.update({
        is_active: true,
        updatedAt: new Date()
      });
      
      return { message: 'Taluk activated successfully' };
    } catch (error) {
      throw new Error(`Failed to activate taluk: ${error.message}`);
    }
  }

  // Deactivate taluk
  async deactivateTaluk(talukId) {
    try {
      const talukRef = db.collection(this.collectionName).doc(talukId);
      const talukDoc = await talukRef.get();
      
      if (!talukDoc.exists) {
        throw new Error('Taluk not found');
      }

      await talukRef.update({
        is_active: false,
        updatedAt: new Date()
      });
      
      return { message: 'Taluk deactivated successfully' };
    } catch (error) {
      throw new Error(`Failed to deactivate taluk: ${error.message}`);
    }
  }

  // Archive taluk
  async archiveTaluk(talukId) {
    try {
      const talukRef = db.collection(this.collectionName).doc(talukId);
      const talukDoc = await talukRef.get();
      
      if (!talukDoc.exists) {
        throw new Error('Taluk not found');
      }

      await talukRef.update({
        is_archived: true,
        updatedAt: new Date()
      });
      
      return { message: 'Taluk archived successfully' };
    } catch (error) {
      throw new Error(`Failed to archive taluk: ${error.message}`);
    }
  }

  // Get taluk statistics
  async getTalukStats() {
    try {
      const querySnapshot = await db.collection(this.collectionName).get();
      
      let totalTaluks = 0;
      let activeTaluks = 0;
      let archivedTaluks = 0;
      const districtStats = {};
      
      querySnapshot.forEach((doc) => {
        const talukData = doc.data();
        totalTaluks++;
        
        if (talukData.is_active) {
          activeTaluks++;
        }
        
        if (talukData.is_archived) {
          archivedTaluks++;
        }
        
        if (talukData.district) {
          districtStats[talukData.district] = (districtStats[talukData.district] || 0) + 1;
        }
      });
      
      return {
        totalTaluks,
        activeTaluks,
        archivedTaluks,
        districtStats
      };
    } catch (error) {
      throw new Error(`Failed to get taluk statistics: ${error.message}`);
    }
  }
}

module.exports = new TalukService();
