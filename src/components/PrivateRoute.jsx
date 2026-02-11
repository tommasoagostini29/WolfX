// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  // Se l'utente esiste, mostra la pagina richiesta (children)
  // Altrimenti, reindirizza alla pagina di Login
  return currentUser ? children : <Navigate to="/login" />;
}