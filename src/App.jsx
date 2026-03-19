import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Offline from "./pages/Offline";
import Home from "./pages/Home";
import Market from "./pages/Market";
import PrivateRoute from "./components/PrivateRoute";
import BottomNav from "./components/BottomNav";
import "./App.css";

const App = () => {
  const [connesso, setConnesso] = useState(navigator.onLine);

  useEffect(() => {
    const tornaOnline = () => setConnesso(true);
    const vaiOffline = () => setConnesso(false);
    
    window.addEventListener("online", tornaOnline);
    window.addEventListener("offline", vaiOffline);
    
    return () => {
      window.removeEventListener("online", tornaOnline);
      window.removeEventListener("offline", vaiOffline);
    };
  }, []);

  if (!connesso) return <Offline />;

  return (
    <Router>
      <AuthProvider>
        <div className="container-app">
          <Toaster position="top-center" />
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
};

export default App;