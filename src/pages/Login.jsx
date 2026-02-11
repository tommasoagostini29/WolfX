// src/pages/Login.jsx
import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/"); // Se il login riesce, vai alla Dashboard
    } catch {
      setError("Impossibile accedere. Controlla email e password.");
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #333", borderRadius: "8px" }}>
      <h2>Accedi a WolfX</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input type="email" ref={emailRef} placeholder="Email" required style={{ padding: "10px" }} />
        <input type="password" ref={passwordRef} placeholder="Password" required style={{ padding: "10px" }} />
        
        <button disabled={loading} type="submit" style={{ padding: "10px", background: "#00d1b2", color: "white", border: "none", cursor: "pointer" }}>
          Accedi
        </button>
      </form>
      
      <div style={{ marginTop: "10px" }}>
        Non hai un account? <Link to="/signup" style={{ color: "#00d1b2" }}>Registrati</Link>
      </div>
    </div>
  );
}