// src/pages/Signup.jsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { db, auth } from "../firebase"; 
import { doc, setDoc } from "firebase/firestore";
import { sendEmailVerification, signOut } from "firebase/auth";

import "./Signup.css"; // Stili separati

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (password !== passwordConfirm) {
      return setError("Le password non coincidono.");
    }

    try {
      setError("");
      setLoading(true);

      await signup(email, password);
      const user = auth.currentUser;

      // Initialize user profile in Firestore with starting balance
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        balance: 10000,
        portfolio: {}
      });

      await sendEmailVerification(user);
      await signOut(auth);

      // Nota: in futuro potresti sostituire questo alert con un componente Toast
      alert("Registrazione completata! Ti abbiamo inviato un'email di verifica. Controlla la tua casella di posta.");
      navigate("/login");

    } catch (err) {
      console.error("Signup error:", err);
      // Fallback basilare per errori comuni
      if (err.code === 'auth/email-already-in-use') {
        setError("Questa email è già registrata.");
      } else if (err.code === 'auth/weak-password') {
        setError("La password deve essere di almeno 6 caratteri.");
      } else {
        setError("Si è verificato un errore durante la registrazione.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
      <h2>Registrati a WolfX</h2>
      
      {error && <p className="signup-error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="signup-form">
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
          value={passwordConfirm} 
          onChange={e => setPasswordConfirm(e.target.value)} 
          placeholder="Conferma Password" 
        />
        
        <button disabled={loading} type="submit" className="signup-button">
          {loading ? "Creazione in corso..." : "Registrati"}
        </button>
      </form>
      
      <div className="signup-footer">
        Hai già un account? <Link to="/login">Accedi</Link>
      </div>
    </div>
  );
}