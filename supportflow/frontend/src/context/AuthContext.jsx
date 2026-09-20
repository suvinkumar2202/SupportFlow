import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]               = useState(null);
  const [token, setToken]             = useState(null);
  const [isAuthenticated, setIsAuth]  = useState(false);
  const [loading, setLoading]         = useState(true);

  // On mount: restore session from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsed);
        setIsAuth(true);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, remember = false) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { success, data, message } = response.data;

      if (success && data) {
        const { token: jwt, user: userData } = data;

        setToken(jwt);
        setUser(userData);
        setIsAuth(true);

        // Always persist to localStorage (remember me controls session vs persistent)
        localStorage.setItem('token', jwt);
        localStorage.setItem('user', JSON.stringify(userData));
        if (!remember) {
          // Flag so we can clear on tab close if desired (optional extension)
          sessionStorage.setItem('sessionOnly', 'true');
        }

        return { success: true, message, user: userData };
      }

      return { success: false, message: message || 'Login failed' };
    } catch (error) {
      if (error.response) {
        // Server responded with an error status (e.g. 401 invalid credentials)
        const msg = error.response.data?.message || 'Invalid email or password';
        return { success: false, message: msg };
      }
      // No response received -> backend is down / unreachable
      return { success: false, message: 'Unable to connect to server. Please try again.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const { success, data, message } = response.data;

      if (success && data) {
        const { token: jwt, user: userData } = data;

        setToken(jwt);
        setUser(userData);
        setIsAuth(true);

        localStorage.setItem('token', jwt);
        localStorage.setItem('user', JSON.stringify(userData));

        return { success: true, message, user: userData };
      }

      return { success: false, message: message || 'Registration failed' };
    } catch (error) {
      if (error.response) {
        const msg = error.response.data?.message || 'Registration failed';
        return { success: false, message: msg };
      }
      return { success: false, message: 'Unable to connect to server. Please try again.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuth(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('sessionOnly');
  };

  const refreshUser = async () => {
    try {
      const response = await api.get('/users/me');
      if (response.data.success && response.data.data) {
        setUser(response.data.data);
        localStorage.setItem('user', JSON.stringify(response.data.data));
        return response.data.data;
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
    return null;
  };

  const getRole = () => user?.role || null;

  const isAdmin = () => getRole() === 'ADMIN';
  const isAgent = () => getRole() === 'SUPPORT_AGENT';
  const isCustomer = () => getRole() === 'CUSTOMER';

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout, refreshUser, getRole, isAdmin, isAgent, isCustomer }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
