import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import TicketDetail from './pages/TicketDetail';
import Feedback from './pages/Feedback';
import Profile from './pages/Profile';
import Agents from './pages/Agents';
import AdminUsers from './pages/AdminUsers';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/dashboard" replace />;
  return children;
};

const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/tickets" element={
          <ProtectedRoute>
            <Layout><Tickets /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/tickets/new" element={
          <ProtectedRoute>
            <Layout><Tickets /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/tickets/:id" element={
          <ProtectedRoute>
            <Layout><TicketDetail /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/feedback" element={
          <ProtectedRoute>
            <Layout><Feedback /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/feedback/new" element={
          <ProtectedRoute>
            <Layout><Feedback /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/agents" element={
          <ProtectedRoute>
            <Layout><Agents /></Layout>
          </ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute>
            <AdminRoute><Layout><AdminUsers /></Layout></AdminRoute>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Layout><Profile /></Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
