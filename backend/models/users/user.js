// models/User.js

class User {
  constructor(data) {
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.name = data.name || `${this.firstName} ${this.lastName}`.trim();
    this.district = data.district || '';
    this.village = data.village || '';
    this.taluk = data.taluk || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.age = data.age || null;
    this.gender = data.gender || '';
    this.address = data.address || '';
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
    this.isActive = data.isActive !== undefined ? data.isActive : true;
  }

  // Validation method
  validate() {
    const errors = [];
    
    if (!this.name.trim()) {
      errors.push('Name is required');
    }
    
    if (!this.district.trim()) {
      errors.push('District is required');
    }
    
    if (!this.village.trim()) {
      errors.push('Village is required');
    }
    
    if (!this.taluk.trim()) {
      errors.push('Taluk is required');
    }
    
    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('Invalid email format');
    }
    
    if (this.phone && !this.isValidPhone(this.phone)) {
      errors.push('Invalid phone number format');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  }

  // Convert to plain object for Firestore
  toFirestore() {
    return {
      name: this.name,
      firstName: this.firstName,
      lastName: this.lastName,
      district: this.district,
      village: this.village,
      taluk: this.taluk,
      email: this.email,
      phone: this.phone,
      age: this.age,
      gender: this.gender,
      address: this.address,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      isActive: this.isActive
    };
  }

  // Create from Firestore document
  static fromFirestore(doc) {
    const data = doc.data();
    return new User({
      id: doc.id,
      ...data
    });
  }
}

module.exports = User;
