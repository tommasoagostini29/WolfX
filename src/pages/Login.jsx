import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, sendEmailVerification } from "firebase/auth";

import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      
      const userCredential = await login(email, password);
      
      if (!userCredential.user.emailVerified) {
        await sendEmailVerification(userCredential.user);
        await signOut(auth);
        
        setError("Account non verificato. Ti abbiamo inviato un nuovo link via email. Controlla anche lo spam.");
        setLoading(false);
        return;
      }

      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Email o password errati.");
    } finally {
      setLoading(false); 
    }
  }

  return (
    <div className="login-container">
      <h2>Accedi a WolfX</h2>
      
      {error && <p className="login-error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="login-form">
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
          placeholder="Password" 
        />
        
        <button disabled={loading} type="submit" className="login-button">
          {loading ? "Accesso..." : "Entra"}
        </button>
      </form>
      
      <div className="login-footer">
        Non hai un account? <Link to="/signup">Registrati</Link>
      </div>
    </div>
  );
}