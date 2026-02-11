import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Offline from "./pages/Offline"; // Importa la pagina offline
import PrivateRoute from "./components/PrivateRoute";

function App() {
  // Stato per controllare se siamo online
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Funzioni per aggiornare lo stato
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Ascolta gli eventi del browser
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Pulizia
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // SE SIAMO OFFLINE, MOSTRA SOLO LA PAGINA DI ERRORE
  if (!isOnline) {
    return <Offline />;
  }

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;