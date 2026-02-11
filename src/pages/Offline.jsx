import React from "react";

export default function Offline() {
  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center", 
      background: "#1a1a1a", 
      color: "white",
      textAlign: "center",
      padding: "20px"
    }}>
      <div style={{ fontSize: "50px", marginBottom: "20px" }}>📡</div>
      <h2>Sei Offline</h2>
      <p style={{ color: "#888", maxWidth: "300px", margin: "10px auto" }}>
        Sembra che non ci sia connessione internet. WolfX ha bisogno della rete per i dati di mercato in tempo reale.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        style={{ marginTop: "20px", padding: "10px 20px", background: "#00d1b2", border: "none", borderRadius: "5px", color: "white", cursor: "pointer" }}
      >
        Riprova
      </button>
    </div>
  );
}