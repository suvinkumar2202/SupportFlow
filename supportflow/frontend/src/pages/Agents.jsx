import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const roleLabels = {
  CUSTOMER: 'Customer',
  SUPPORT_AGENT: 'Support Agent',
  ADMIN: 'Admin',
};

const Agents = () => {
  const { isAdmin, isAgent } = useAuth();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAgents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/users/agents');
      if (response.data.success) {
        setAgents(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load agents');
      }
    } catch (err) {
      setError('Failed to load agents');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Support Agents</h1>
        <p className="page-subtitle">
          {isAdmin() ? 'Manage support agents' : 'Available support staff'}
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      ) : agents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No agents available</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {agents.map(agent => (
                <tr key={agent.id}>
                  <td>{agent.name}</td>
                  <td>{agent.email}</td>
                  <td>
                    <span className="role-badge">{roleLabels[agent.role] || agent.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Agents;
