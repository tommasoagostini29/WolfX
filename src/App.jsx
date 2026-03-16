// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Offline from "./pages/Offline";
import Home from "./pages/Home";
import Market from "./pages/Market";

import PrivateRoute from "./components/PrivateRoute";
import BottomNav from "./components/BottomNav";

import "./App.css";

function App() {
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
        <div className="app-layout">
          <Routes>
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/market" 
              element={
                <PrivateRoute>
                  <Market />
                </PrivateRoute>
              } 
            />
            
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
          </Routes>

          <BottomNav />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;