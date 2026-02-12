// src/components/BottomNav.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom"; // Importiamo Link e useLocation
import { useAuth } from "../contexts/AuthContext";

export default function BottomNav() {
  const { logout } = useAuth();
  const location = useLocation(); // Serve per sapere in che pagina siamo e colorare l'icona

  // Nascondi la barra se siamo nel login/signup
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  // Stile base per i pulsanti
  const btnStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "none",
    border: "none",
    color: "#888",
    padding: "10px",
    cursor: "pointer",
    fontSize: "0.7em",
    textDecoration: "none" // Toglie la sottolineatura tipica dei link
  };

  const activeColor = "#00d1b2"; // Colore verde WolfX quando attivo

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, height: "60px",
      background: "#222", borderTop: "1px solid #333",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      zIndex: 1000, boxShadow: "0 -5px 10px rgba(0,0,0,0.3)"
    }}>
      
      {/* 1. TASTO HOME -> Punta a "/" */}
      <Link to="/" style={{ ...btnStyle, color: location.pathname === "/" ? activeColor : "#888" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span style={{ marginTop: "4px" }}>Home</span>
      </Link>

      {/* 2. TASTO MERCATO -> Punta a "/market" */}
      <Link to="/market" style={{ ...btnStyle, color: location.pathname === "/market" ? activeColor : "#888" }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="18" y1="20" x2="18" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
        <span style={{ marginTop: "4px" }}>Mercato</span>
      </Link>

      {/* 3. TASTO ESCI -> Resta un bottone normale */}
      <button onClick={logout} style={btnStyle}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span style={{ marginTop: "4px" }}>Esci</span>
      </button>

    </div>
  );
}