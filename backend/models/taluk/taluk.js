// models/Taluk.js
const db = require('../../config/config');

class Taluk {
  constructor(data) {
    this.taluk_id = data.taluk_id || 0;
    this.name = data.name || '';
    this.k_name = data.k_name || '';
    this.district = data.district || ''; // Firestore document ID reference
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.is_archived = data.is_archived !== undefined ? data.is_archived : false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.name || !this.name.trim()) {
      errors.push('Taluk name is required');
    }
    
    if (!this.district || !this.district.trim()) {
      errors.push('District reference is required');
    }
    
    if (this.taluk_id !== undefined && (isNaN(this.taluk_id) || this.taluk_id < 0)) {
      errors.push('Taluk ID must be a non-negative number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      taluk_id: this.taluk_id,
      name: this.name,
      k_name: this.k_name,
      district: this.district, // Store as document reference ID
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
      taluk_id: data.taluk_id,
      name: data.name,
      k_name: data.k_name,
      district: data.district,
      is_active: data.is_active,
      is_archived: data.is_archived,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }

  // Populate district reference (similar to Mongoose populate)
  static async fromFirestoreWithPopulate(doc) {
    const talukData = Taluk.fromFirestore(doc);
    
    try {
      // Fetch referenced district
      if (talukData.district) {
        const districtDoc = await db.collection('districts').doc(talukData.district).get();
        if (districtDoc.exists) {
          const District = require('./District');
          talukData.district = District.fromFirestore(districtDoc);
        }
      }
    } catch (error) {
      console.log('Error populating district:', error.message);
    }
    
    return talukData;
  }

  // Transform response
  toJSON() {
    const obj = this.toFirestore();
    return obj;
  }
}

module.exports = Taluk;