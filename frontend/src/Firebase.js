// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDO-nhJM3VHVbzg6Qt1M-YiBR1LdzxrKNc",
  authDomain: "jamhub-auth.firebaseapp.com",
  projectId: "jamhub-auth",
  storageBucket: "jamhub-auth.firebasestorage.app",
  messagingSenderId: "1058946500894",
  appId: "1:1058946500894:web:d2793a2b57065fbfa0a10f",
  measurementId: "G-WQXW8B1JG7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Firebase initialisieren
// Auth-Objekt aus der App holen
const auth = getAuth(app);

export { auth };

