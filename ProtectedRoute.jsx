// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // Check if user is logged in

  if (!token) {
    return <Navigate to="/" />; // If no token, redirect to login page
  }

  return children; // Otherwise, show the protected page
};

export default ProtectedRoute;
