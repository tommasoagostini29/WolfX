import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase"; 
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [utente, setUtente] = useState(null);
  const [inCaricamento, setInCaricamento] = useState(true);

  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password); /* ho creato delle funzioni che solo più semplici da chiamare rispetto a quelel fornite da firebase*/
  
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const logout = () => signOut(auth); 

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUtente(user);
      setInCaricamento(false);
    });
    
    return () => unsub();
  }, []);

  const authData = {
    currentUser: utente,
    signup,
    login,
    logout
  }; /* questo è l'oggetto che volevamo creare poi da poter passare a tutta l'app */

  return (
    <AuthContext.Provider value={authData}>
      {!inCaricamento && children}
    </AuthContext.Provider>
  );
};