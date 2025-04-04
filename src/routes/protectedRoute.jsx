import React from "react";
import { Navigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // Install this package if you're using JWTs

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  const isTokenValid = (token) => {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token); // Decode the token
      const currentTime = Date.now() / 1000; // Current time in seconds
      return decoded.exp > currentTime; // Check if the token is expired
    } catch (error) {
      console.error("Invalid token:", error);
      return false;
    }
  };

  if (!isTokenValid(token)) {
    // Redirect to the auth page if the token is invalid or expired
    return <Navigate to="/auth" replace />;
  }

  // Render the protected content if the token is valid
  return children;
};

export default ProtectedRoute;