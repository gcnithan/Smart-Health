// models/Village.js
const db = require('../../config/config');

class Village {
  constructor(data) {
    this.village_id = data.village_id || 0;
    this.village_code = data.village_code || '0';
    this.name = data.name || '';
    this.k_name = data.k_name || '';
    this.district = data.district || ''; // Firestore document ID reference
    this.taluk = data.taluk || ''; // Firestore document ID reference
    this.hobli = data.hobli || ''; // Firestore document ID reference
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.is_archived = data.is_archived !== undefined ? data.is_archived : false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.name || !this.name.trim()) {
      errors.push('Village name is required');
    }
    
    if (!this.village_code || !this.village_code.trim()) {
      errors.push('Village code is required');
    }
    
    if (!this.district || !this.district.trim()) {
      errors.push('District reference is required');
    }
    
    if (!this.taluk || !this.taluk.trim()) {
      errors.push('Taluk reference is required');
    }
    
    if (!this.hobli || !this.hobli.trim()) {
      errors.push('Hobli reference is required');
    }
    
    if (this.village_id !== undefined && (isNaN(this.village_id) || this.village_id < 0)) {
      errors.push('Village ID must be a non-negative number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      village_id: this.village_id,
      village_code: this.village_code,
      name: this.name,
      k_name: this.k_name,
      district: this.district, // Store as document reference ID
      taluk: this.taluk, // Store as document reference ID
      hobli: this.hobli, // Store as document reference ID
      is_active: this.is_active,
      is_archived: this.is_archived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return {
      id: doc.id, // Firestore document ID
      village_id: data.village_id,
      village_code: data.village_code,
      name: data.name,
      k_name: data.k_name,
      district: data.district,
      taluk: data.taluk,
      hobli: data.hobli,
      is_active: data.is_active,
      is_archived: data.is_archived,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }

  // Populate all references (similar to Mongoose populate)
  static async fromFirestoreWithPopulate(doc) {
    const villageData = Village.fromFirestore(doc);
    
    try {
      // Fetch referenced district
      if (villageData.district) {
        const districtDoc = await db.collection('districts').doc(villageData.district).get();
        if (districtDoc.exists) {
          const District = require('./District');
          villageData.district = District.fromFirestore(districtDoc);
        }
      }
      
      // Fetch referenced taluk
      if (villageData.taluk) {
        const talukDoc = await db.collection('taluks').doc(villageData.taluk).get();
        if (talukDoc.exists) {
          const Taluk = require('./Taluk');
          villageData.taluk = Taluk.fromFirestore(talukDoc);
        }
      }
      
      // Fetch referenced hobli
      if (villageData.hobli) {
        const hobliDoc = await db.collection('hoblis').doc(villageData.hobli).get();
        if (hobliDoc.exists) {
          // Assuming you have a Hobli model
          villageData.hobli = {
            id: hobliDoc.id,
            ...hobliDoc.data()
          };
        }
      }
    } catch (error) {
      console.log('Error populating references:', error.message);
    }
    
    return villageData;
  }

  // Transform response
  toJSON() {
    const obj = this.toFirestore();
    return obj;
  }
}

module.exports = Village;