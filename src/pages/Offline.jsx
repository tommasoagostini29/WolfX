// src/components/Offline.jsx (o src/pages/Offline.jsx)
import React from "react";
import "./Offline.css"; // Importiamo gli stili esterni

export default function Offline() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="offline-container">
      <div className="offline-icon">📡</div>
      <h2>Sei Offline</h2>
      <p className="offline-text">
        Sembra che non ci sia connessione internet. WolfX ha bisogno della rete per i dati di mercato in tempo reale.
      </p>
      <button onClick={handleReload} className="offline-button">
        Riprova
      </button>
    </div>
  );
}