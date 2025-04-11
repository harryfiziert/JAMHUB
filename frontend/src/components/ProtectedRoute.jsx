import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../Firebase";

// Diese Komponente schützt eine Route
const ProtectedRoute = ({ children }) => {
  const user = auth.currentUser;

  // Wenn kein Nutzer da ist, redirect zu /login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
