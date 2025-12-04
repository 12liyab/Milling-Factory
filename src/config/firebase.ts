import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDUGTnEG2ur8yrJKe21P1nq5PlfGZ-TWuw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "mellodvla.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://mellodvla-default-rtdb.firebaseio.com/",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "mellodvla",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "mellodvla.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "77005647763",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:77005647763:web:d2e6514b6e456c64658266",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-M52241ZMJY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);
