// models/Hobli.js
const db = require('../../config/config');

class Hobli {
  constructor(data) {
    this.hobli_id = data.hobli_id || 0;
    this.name = data.name || '';
    this.k_name = data.k_name || '';
    this.district = data.district || ''; // Firestore document ID reference
    this.taluk = data.taluk || ''; // Firestore document ID reference
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.is_archived = data.is_archived !== undefined ? data.is_archived : false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.name || !this.name.trim()) {
      errors.push('Hobli name is required');
    }
    
    if (!this.district || !this.district.trim()) {
      errors.push('District reference is required');
    }
    
    if (!this.taluk || !this.taluk.trim()) {
      errors.push('Taluk reference is required');
    }
    
    if (this.hobli_id !== undefined && (isNaN(this.hobli_id) || this.hobli_id < 0)) {
      errors.push('Hobli ID must be a non-negative number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      hobli_id: this.hobli_id,
      name: this.name,
      k_name: this.k_name,
      district: this.district,
      taluk: this.taluk,
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
      id: doc.id,
      hobli_id: data.hobli_id,
      name: data.name,
      k_name: data.k_name,
      district: data.district,
      taluk: data.taluk,
      is_active: data.is_active,
      is_archived: data.is_archived,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }

  // Populate references
  static async fromFirestoreWithPopulate(doc) {
    const hobliData = Hobli.fromFirestore(doc);
    
    try {
      // Fetch referenced district
      if (hobliData.district) {
        const districtDoc = await db.collection('districts').doc(hobliData.district).get();
        if (districtDoc.exists) {
          const District = require('./District');
          hobliData.district = District.fromFirestore(districtDoc);
        }
      }
      
      // Fetch referenced taluk
      if (hobliData.taluk) {
        const talukDoc = await db.collection('taluks').doc(hobliData.taluk).get();
        if (talukDoc.exists) {
          const Taluk = require('./Taluk');
          hobliData.taluk = Taluk.fromFirestore(talukDoc);
        }
      }
    } catch (error) {
      console.log('Error populating references:', error.message);
    }
    
    return hobliData;
  }

  // Transform response
  toJSON() {
    const obj = this.toFirestore();
    return obj;
  }
}

module.exports = Hobli;