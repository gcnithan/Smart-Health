// services/hobliService.js
const db = require('../config/config');
const Hobli = require('../models/hobli/hobli');

class HobliService {
  constructor() {
    this.collectionName = 'hoblis';
  }

  // Create a new hobli
  async createHobli(hobliData) {
    try {
      const hobli = new Hobli(hobliData);
      const validation = hobli.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      hobli.createdAt = new Date();
      hobli.updatedAt = new Date();
      
      const docRef = await db.collection(this.collectionName).add(hobli.toFirestore());
      
      return {
        id: docRef.id,
        ...hobli.toFirestore()
      };
    } catch (error) {
      throw new Error(`Failed to create hobli: ${error.message}`);
    }
  }

  // Get hobli by ID
  async getHobliById(hobliId) {
    try {
      const hobliDoc = await db.collection(this.collectionName).doc(hobliId).get();
      
      if (!hobliDoc.exists) {
        throw new Error('Hobli not found');
      }
      
      return {
        id: hobliDoc.id,
        ...hobliDoc.data()
      };
    } catch (error) {
      throw new Error(`Failed to get hobli: ${error.message}`);
    }
  }

  // Get hobli by ID with populated references
  async getHobliByIdWithPopulate(hobliId) {
    try {
      const hobliDoc = await db.collection(this.collectionName).doc(hobliId).get();
      
      if (!hobliDoc.exists) {
        throw new Error('Hobli not found');
      }
      
      return await Hobli.fromFirestoreWithPopulate(hobliDoc);
    } catch (error) {
      throw new Error(`Failed to get hobli with populate: ${error.message}`);
    }
  }

  // Get all hoblis with optional filters
  async getAllHoblis(filters = {}) {
    try {
      let query = db.collection(this.collectionName);
      
      // Apply filters
      if (filters.district) {
        query = query.where('district', '==', filters.district);
      }
      
      if (filters.taluk) {
        query = query.where('taluk', '==', filters.taluk);
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
      const hoblis = [];
      
      querySnapshot.forEach((doc) => {
        hoblis.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return hoblis;
    } catch (error) {
      throw new Error(`Failed to get hoblis: ${error.message}`);
    }
  }

  // Get hoblis by district
  async getHoblisByDistrict(districtId) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('district', '==', districtId)
        .where('is_active', '==', true)
        .orderBy('name', 'asc')
        .get();
      
      const hoblis = [];
      querySnapshot.forEach((doc) => {
        hoblis.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return hoblis;
    } catch (error) {
      throw new Error(`Failed to get hoblis by district: ${error.message}`);
    }
  }

  // Get hoblis by taluk
  async getHoblisByTaluk(talukId) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('taluk', '==', talukId)
        .where('is_active', '==', true)
        .orderBy('name', 'asc')
        .get();
      
      const hoblis = [];
      querySnapshot.forEach((doc) => {
        hoblis.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return hoblis;
    } catch (error) {
      throw new Error(`Failed to get hoblis by taluk: ${error.message}`);
    }
  }

  // Update hobli by ID
  async updateHobli(hobliId, updateData) {
    try {
      const hobliRef = db.collection(this.collectionName).doc(hobliId);
      const hobliDoc = await hobliRef.get();
      
      if (!hobliDoc.exists) {
        throw new Error('Hobli not found');
      }

      // Validate update data
      const hobli = new Hobli({ ...hobliDoc.data(), ...updateData });
      const validation = hobli.validate();
      
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      updateData.updatedAt = new Date();
      
      await hobliRef.update(updateData);
      
      return {
        id: hobliId,
        ...hobliDoc.data(),
        ...updateData
      };
    } catch (error) {
      throw new Error(`Failed to update hobli: ${error.message}`);
    }
  }

  // Delete hobli by ID
  async deleteHobli(hobliId) {
    try {
      const hobliRef = db.collection(this.collectionName).doc(hobliId);
      const hobliDoc = await hobliRef.get();
      
      if (!hobliDoc.exists) {
        throw new Error('Hobli not found');
      }

      await hobliRef.delete();
      
      return { message: 'Hobli deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete hobli: ${error.message}`);
    }
  }

  // Search hoblis by name
  async searchHoblisByName(searchTerm) {
    try {
      const querySnapshot = await db.collection(this.collectionName)
        .where('name', '>=', searchTerm)
        .where('name', '<=', searchTerm + '\uf8ff')
        .get();
      
      const hoblis = [];
      querySnapshot.forEach((doc) => {
        hoblis.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return hoblis;
    } catch (error) {
      throw new Error(`Failed to search hoblis: ${error.message}`);
    }
  }

  // Activate hobli
  async activateHobli(hobliId) {
    try {
      const hobliRef = db.collection(this.collectionName).doc(hobliId);
      const hobliDoc = await hobliRef.get();
      
      if (!hobliDoc.exists) {
        throw new Error('Hobli not found');
      }

      await hobliRef.update({
        is_active: true,
        updatedAt: new Date()
      });
      
      return { message: 'Hobli activated successfully' };
    } catch (error) {
      throw new Error(`Failed to activate hobli: ${error.message}`);
    }
  }

  // Deactivate hobli
  async deactivateHobli(hobliId) {
    try {
      const hobliRef = db.collection(this.collectionName).doc(hobliId);
      const hobliDoc = await hobliRef.get();
      
      if (!hobliDoc.exists) {
        throw new Error('Hobli not found');
      }

      await hobliRef.update({
        is_active: false,
        updatedAt: new Date()
      });
      
      return { message: 'Hobli deactivated successfully' };
    } catch (error) {
      throw new Error(`Failed to deactivate hobli: ${error.message}`);
    }
  }

  // Archive hobli
  async archiveHobli(hobliId) {
    try {
      const hobliRef = db.collection(this.collectionName).doc(hobliId);
      const hobliDoc = await hobliRef.get();
      
      if (!hobliDoc.exists) {
        throw new Error('Hobli not found');
      }

      await hobliRef.update({
        is_archived: true,
        updatedAt: new Date()
      });
      
      return { message: 'Hobli archived successfully' };
    } catch (error) {
      throw new Error(`Failed to archive hobli: ${error.message}`);
    }
  }

  // Get hobli statistics
  async getHobliStats() {
    try {
      const querySnapshot = await db.collection(this.collectionName).get();
      
      let totalHoblis = 0;
      let activeHoblis = 0;
      let archivedHoblis = 0;
      const districtStats = {};
      const talukStats = {};
      
      querySnapshot.forEach((doc) => {
        const hobliData = doc.data();
        totalHoblis++;
        
        if (hobliData.is_active) {
          activeHoblis++;
        }
        
        if (hobliData.is_archived) {
          archivedHoblis++;
        }
        
        if (hobliData.district) {
          districtStats[hobliData.district] = (districtStats[hobliData.district] || 0) + 1;
        }
        
        if (hobliData.taluk) {
          talukStats[hobliData.taluk] = (talukStats[hobliData.taluk] || 0) + 1;
        }
      });
      
      return {
        totalHoblis,
        activeHoblis,
        archivedHoblis,
        districtStats,
        talukStats
      };
    } catch (error) {
      throw new Error(`Failed to get hobli statistics: ${error.message}`);
    }
  }
}

module.exports = new HobliService();
