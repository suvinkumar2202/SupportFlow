import React, { useState, useEffect } from 'react';
import api from '../services/api';

const roleLabels = {
  CUSTOMER: 'Customer',
  SUPPORT_AGENT: 'Support Agent',
  ADMIN: 'Admin',
};

const roleColors = {
  CUSTOMER: 'rgba(99,102,241,0.18)',
  SUPPORT_AGENT: 'rgba(20,184,166,0.18)',
  ADMIN: 'rgba(251,191,36,0.18)',
};

const roleTextColors = {
  CUSTOMER: '#a5b4fc',
  SUPPORT_AGENT: '#5eead4',
  ADMIN: '#fcd34d',
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/users');
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load users');
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to load users');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>User Management</h1>
        <p className="page-subtitle">Manage all user accounts and roles</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No users found</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
              <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className="role-badge"
                      style={{
                        backgroundColor: roleColors[u.role] || roleColors.CUSTOMER,
                        color: roleTextColors[u.role] || roleTextColors.CUSTOMER,
                      }}
                    >
                      {roleLabels[u.role] || u.role}
                    </span>
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

export default AdminUsers;
