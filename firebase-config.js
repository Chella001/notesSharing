// ====================================================
//  FIREBASE CONFIGURATION
// ====================================================
// IMPORTANT: Replace the placeholder values below with 
// your actual Firebase project configuration.
//
// How to get your Firebase config:
// 1. Go to https://console.firebase.google.com/
// 2. Select your project
// 3. Click on the web (</>) icon to register your app
// 4. Copy the firebaseConfig object from the code snippet
// 5. Paste it below (replace the entire config object)
// ====================================================

// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",           // e.g., "AIzaSyD..."
  authDomain: "YOUR_AUTH_DOMAIN_HERE",   // e.g., "myapp.firebaseapp.com"
  projectId: "YOUR_PROJECT_ID_HERE",     // e.g., "myapp-12345"
  storageBucket: "YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "YOUR_SENDER_ID_HERE",
  appId: "YOUR_APP_ID_HERE"
};

// ====================================================
// DO NOT MODIFY BELOW THIS LINE
// ====================================================

window.__FIREBASE_CONFIG_VALID = false;

// Check if Firebase is already initialized to avoid double initialization
if (!firebase.apps.length) {
  try {
    // Validate config - check for placeholder values
    const hasPlaceholders = 
      firebaseConfig.apiKey === "YOUR_API_KEY_HERE" ||
      firebaseConfig.authDomain === "YOUR_AUTH_DOMAIN_HERE" ||
      firebaseConfig.projectId === "YOUR_PROJECT_ID_HERE";
    
    if (hasPlaceholders) {
      console.error("❌ Firebase Configuration Error: Please replace the placeholder values in firebase-config.js with your actual Firebase project credentials.");
      window.__FIREBASE_CONFIG_VALID = false;
    } else {
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
      window.__FIREBASE_CONFIG_VALID = true;
      console.log("✅ Firebase initialized successfully!");
    }
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    window.__FIREBASE_CONFIG_VALID = false;
  }
} else {
  // Firebase already initialized, assume it's valid
  window.__FIREBASE_CONFIG_VALID = true;
  console.log("✅ Firebase already initialized.");
}