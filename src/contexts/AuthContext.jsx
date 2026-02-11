import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Importa la config che abbiamo fatto prima
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Funzione per registrarsi
  async function signup(email, password) {
    // 1. Crea l'utente su Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Crea il documento dell'utente nel Database (Firestore)
    // Impostiamo un saldo iniziale di 10.000$ finti
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      balance: 10000,
      portfolio: {} // Portafoglio vuoto
    });

    return user;
  }

  // Funzione per login
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Funzione per logout
  function logout() {
    return signOut(auth);
  }

  // Ascolta i cambiamenti di stato (es. se l'utente chiude e riapre il browser)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}