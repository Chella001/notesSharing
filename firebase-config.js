// firebase-config.js

// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "notessharingapp-fc388.firebaseapp.com",
    projectId: "notessharingapp-fc388",
    storageBucket: "notessharingapp-fc388.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Basic validation: detect placeholder/missing API key and expose a flag
if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR') || firebaseConfig.apiKey.trim() === '') {
    console.error('❌ Firebase API key is missing or uses a placeholder value. Update firebase-config.js with your Web API key from the Firebase Console.');
    // Expose a flag the app can check before attempting auth calls
    window.__FIREBASE_CONFIG_VALID = false;
} else {
    window.__FIREBASE_CONFIG_VALID = true;

    // Initialize Firebase
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase initialized successfully");
    } else {
        console.log("✅ Firebase already initialized");
    }

    // Make Firebase globally available
    window.firebase = firebase;
}