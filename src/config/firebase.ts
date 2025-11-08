import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDUGTnEG2ur8yrJKe21P1nq5PlfGZ-TWuw",
  authDomain: "mellodvla.firebaseapp.com",
  databaseURL: "https://mellodvla-default-rtdb.firebaseio.com/",
  projectId: "mellodvla",
  storageBucket: "mellodvla.firebasestorage.app",
  messagingSenderId: "77005647763",
  appId: "1:77005647763:web:d2e6514b6e456c64658266",
  measurementId: "G-M52241ZMJY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);
