// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// La tua configurazione web dell'app
const firebaseConfig = {
  apiKey: "AIzaSyA6jnjWb-KZlzn93l-kgvP22-3REvGkDs8",
  authDomain: "wolfx-6ab4f.firebaseapp.com",
  projectId: "wolfx-6ab4f",
  storageBucket: "wolfx-6ab4f.firebasestorage.app",
  messagingSenderId: "996274359150",
  appId: "1:996274359150:web:b8d8e8c6dad293b6840f7f"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

// Inizializza i servizi che useremo
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;