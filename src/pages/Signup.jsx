import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { db, auth } from "../firebase"; 
import { doc, setDoc } from "firebase/firestore";
import { sendEmailVerification, signOut } from "firebase/auth";
import toast from "react-hot-toast";

import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confermaPassword, setConfermaPassword] = useState("");
  const [errore, setErrore] = useState("");
  const [caricamento, setCaricamento] = useState(false);
  
  const { signup } = useAuth();
  const naviga = useNavigate();

  const gestisciRegistrazione = async (e) => {
    e.preventDefault();

    if (password !== confermaPassword) {
      return setErrore("Le password non coincidono.");
    }

    try {
      setErrore("");
      setCaricamento(true);

      await signup(email, password);
      const utente = auth.currentUser;

      await setDoc(doc(db, "users", utente.uid), {
        email: email,
        balance: 10000,
        portfolio: {}
      });

      await sendEmailVerification(utente);
      await signOut(auth);

      toast.success("Registrazione completata! Ti abbiamo inviato un'email di verifica.");
      naviga("/login");

    } catch (err) {
      console.error("Problema con la registrazione:", err);
      if (err.code === 'auth/email-already-in-use') {
        setErrore("Questa email è già registrata.");
      } else if (err.code === 'auth/weak-password') {
        setErrore("La password deve essere di almeno 6 caratteri.");
      } else {
        setErrore("Si è verificato un errore durante la registrazione.");
      }
    } finally {
      setCaricamento(false);
    }
  };

  return (
    <div className="container-signup">
      <h2>Registrati a WolfX</h2>
      
      {errore && <p className="signup-error">{errore}</p>}
      
      <form onSubmit={gestisciRegistrazione} className="signup-form">
        <input 
          type="email" 
          required 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Email" 
        />
        <input 
          type="password" 
          required 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Password (min 6 caratteri)" 
        />
        <input 
          type="password" 
          required 
          value={confermaPassword} 
          onChange={e => setConfermaPassword(e.target.value)} 
          placeholder="Conferma Password" 
        />
        
        <button disabled={caricamento} type="submit" className="signup-button">
          {caricamento ? "Creazione in corso..." : "Registrati"}
        </button>
      </form>
      
      <div className="signup-footer">
        Hai già un account? <Link to="/login">Accedi</Link>
      </div>
    </div>
  );
};

export default Signup;