// models/District.js
const db = require('../../config/config');

class District {
  constructor(data) {
    this.district_id = data.district_id || 0;
    this.name = data.name || '';
    this.k_name = data.k_name || '';
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.is_archived = data.is_archived !== undefined ? data.is_archived : false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.name || !this.name.trim()) {
      errors.push('District name is required');
    }
    
    if (this.district_id !== undefined && (isNaN(this.district_id) || this.district_id < 0)) {
      errors.push('District ID must be a non-negative number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      district_id: this.district_id,
      name: this.name,
      k_name: this.k_name,
      is_active: this.is_active,
      is_archived: this.is_archived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Create from Firestore document (similar to toJSON transform)
  static fromFirestore(doc) {
    const data = doc.data();
    return {
      id: doc.id, // Firestore document ID replaces MongoDB _id
      district_id: data.district_id,
      name: data.name,
      k_name: data.k_name,
      is_active: data.is_active,
      is_archived: data.is_archived,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  }

  // Transform response (similar to mongoose toJSON)
  toJSON() {
    const obj = this.toFirestore();
    return obj;
  }
}

module.exports = District;