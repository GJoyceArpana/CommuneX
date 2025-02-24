// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// 🔹 Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAJxYb2vx7AUlCf5_ojvedUyVuOVSbp7Ns",
    authDomain: "communex-686b2.firebaseapp.com",
    projectId: "communex-686b2",
    storageBucket: "communex-686b2.firebasestorage.app",
    messagingSenderId: "944218382208",
    appId: "1:944218382208:web:96dd78d7f9259529522b65",
    measurementId: "G-H90CVX0ZEW"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Correctly export Firestore and Auth
export { db, auth };

