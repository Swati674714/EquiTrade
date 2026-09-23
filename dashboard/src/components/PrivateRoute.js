import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) {
    return <div className="auth-screen"><div className="spinner" /></div>;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
