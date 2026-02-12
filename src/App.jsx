// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Importiamo le pagine di autenticazione
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Offline from "./pages/Offline";

// Importiamo i componenti di utilità
import PrivateRoute from "./components/PrivateRoute";
import BottomNav from "./components/BottomNav";

// --- IMPORTIAMO LE DUE NUOVE PAGINE ---
import Home from "./pages/Home";
import Market from "./pages/Market";

function App() {
  // Gestione stato Online/Offline
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) return <Offline />;

  return (
    <Router>
      <AuthProvider>
        {/* Aggiungiamo padding-bottom per non coprire il contenuto con la barra fissa */}
        <div style={{ paddingBottom: "70px" }}> 
          <Routes>
            
            {/* 1. ROTTA HOME (Il tuo portafoglio) */}
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } 
            />
            
            {/* 2. ROTTA MERCATO (Lista prezzi e acquisto) */}
            <Route 
              path="/market" 
              element={
                <PrivateRoute>
                  <Market />
                </PrivateRoute>
              } 
            />

            {/* Rotte Pubbliche */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          
          </Routes>

          {/* LA BARRA DI NAVIGAZIONE (Visibile sempre) */}
          <BottomNav />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;