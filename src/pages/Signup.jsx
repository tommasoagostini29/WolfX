import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signup } = useAuth(); // Prendiamo la funzione dal Context
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      // Chiamiamo la funzione di registrazione
      await signup(emailRef.current.value, passwordRef.current.value);
      // Se va tutto bene, andiamo alla dashboard (che faremo dopo)
      navigate("/"); 
    } catch (err) {
      console.error(err);
      setError("Errore nella creazione dell'account: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #333", borderRadius: "8px" }}>
      <h2>Crea Account WolfX</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="email" ref={emailRef} placeholder="Email" required style={{ padding: "10px" }} />
        <input type="password" ref={passwordRef} placeholder="Password" required style={{ padding: "10px" }} />
        
        <button disabled={loading} type="submit" style={{ padding: "10px", background: "#00d1b2", color: "white", border: "none", cursor: "pointer" }}>
          Registrati
        </button>
      </form>
      
      <div style={{ marginTop: "10px" }}>
        Hai già un account? <Link to="/login" style={{ color: "#00d1b2" }}>Accedi</Link>
      </div>
    </div>
  );
}