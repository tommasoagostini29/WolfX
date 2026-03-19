import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import "./BottomNav.css";

const BottomNav = () => {
  const { logout } = useAuth();
  const percorso = useLocation();

  if (percorso.pathname === "/login" || percorso.pathname === "/signup") {
    return null;
  }

  return (
    <nav className="barra-navigazione">
      
      <Link 
        to="/" 
        className={`nav-item ${percorso.pathname === "/" ? "active" : ""}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Home</span>
      </Link>

      <Link 
        to="/market" 
        className={`nav-item ${percorso.pathname === "/market" ? "active" : ""}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="20" x2="12" y2="10"></line>
          <line x1="18" y1="20" x2="18" y2="4"></line>
          <line x1="6" y1="20" x2="6" y2="16"></line>
        </svg>
        <span>Mercato</span>
      </Link>

      <button onClick={logout} className="nav-item">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        <span>Esci</span>
      </button>

    </nav>
  );
};

export default BottomNav;