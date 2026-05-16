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

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("✅ Firebase initialized successfully");
} else {
    console.log("✅ Firebase already initialized");
}

// Make Firebase globally available
window.firebase = firebase;