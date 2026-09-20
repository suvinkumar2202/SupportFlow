import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps any route that requires authentication.
 * If the user is not logged in → redirect to /login.
 * While auth state is still loading → show nothing (prevents flash).
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Full-screen loading state while restoring session from localStorage
    return (
      <div className="auth-wrapper">
        <div className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }}></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
