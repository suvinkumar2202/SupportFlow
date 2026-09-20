import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, refreshUser, getRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    refreshUser();
  }, []);

  const roleLabel = (role) => {
    const labels = {
      CUSTOMER: 'Customer',
      SUPPORT_AGENT: 'Support Agent',
      ADMIN: 'Admin',
    };
    return labels[role] || role;
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'SF';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Profile</h1>
        <p className="page-subtitle">Your account information</p>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="card" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 28, color: '#fff'
            }}>
              {initials}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px' }}>{user?.name}</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>{user?.email}</p>
              <span
                className="role-badge"
                style={{
                  display: 'inline-block',
                  marginTop: '8px',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {roleLabel(getRole())}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px' }}>Account Details</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Full Name</span>
                <span>{user?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Email</span>
                <span>{user?.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>User ID</span>
                <span>#{user?.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Role</span>
                <span>{roleLabel(getRole())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
