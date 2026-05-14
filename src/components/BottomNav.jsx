import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Home, LineChart, LogOut } from "lucide-react";
import "./BottomNav.css";

const BottomNav = () => {
  const { logout } = useAuth();
  const percorso = useLocation();

  /* barra non visibile se siamo sulla pagina di login o signup */
  if (percorso.pathname === "/login" || percorso.pathname === "/signup") {
    return null;
  }

  return (
    <nav className="barra-navigazione">
      
      {/* tasto 1 home */}
      <Link 
        to="/" 
        className={`nav-item ${percorso.pathname === "/" ? "active" : ""}`}
      >
        <Home size={24}/>
        <span>Home</span>
      </Link>

      {/* tasto 2 market */}
      <Link 
        to="/market" 
        className={`nav-item ${percorso.pathname === "/market" ? "active" : ""}`}
      >
        <LineChart size={24}/>
        <span>Mercato</span>
      </Link>

      {/* tasto 3 logout */}
      <button onClick={logout} className="nav-item">
        <LogOut size={24} />
        <span>Esci</span>
      </button>

    </nav>
  );
};

export default BottomNav;