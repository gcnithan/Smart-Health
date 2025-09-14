// config/config.js
const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin SDK
let db;

try {
  // Check if Firebase is already initialized
  if (admin.apps.length === 0) {
    const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
    const serviceAccount = require(serviceAccountPath);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }
  
  db = admin.firestore();
  console.log("✅ Firestore connection initialized successfully");
} catch (error) {
  console.error("❌ Error initializing Firestore:", error.message);
  process.exit(1);
}

module.exports = db;
