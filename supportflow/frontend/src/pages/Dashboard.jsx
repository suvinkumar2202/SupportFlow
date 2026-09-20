import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PRIORITY_COLORS = {
  LOW: { bg: 'rgba(99,102,241,0.18)', text: '#a5b4fc', border: 'rgba(99,102,241,0.4)' },
  MEDIUM: { bg: 'rgba(251,191,36,0.18)', text: '#fcd34d', border: 'rgba(251,191,36,0.4)' },
  HIGH: { bg: 'rgba(239,68,68,0.18)', text: '#fca5a5', border: 'rgba(239,68,68,0.4)' },
  CRITICAL: { bg: 'rgba(220,38,38,0.25)', text: '#fecaca', border: 'rgba(220,38,38,0.5)' },
};

const ROLE_COLORS = {
  CUSTOMER: { bg: 'rgba(99,102,241,0.18)', text: '#a5b4fc', border: 'rgba(99,102,241,0.4)' },
  SUPPORT_AGENT: { bg: 'rgba(20,184,166,0.18)', text: '#5eead4', border: 'rgba(20,184,166,0.4)' },
  ADMIN: { bg: 'rgba(251,191,36,0.18)', text: '#fcd34d', border: 'rgba(251,191,36,0.4)' },
};

const Dashboard = () => {
  const { user, logout, getRole } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  const roleStyle = ROLE_COLORS[user?.role] ?? ROLE_COLORS.CUSTOMER;
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'SF';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ticketRes, feedbackRes] = await Promise.all([
          api.get('/tickets'),
          api.get('/feedback'),
        ]);
        if (ticketRes.data.success) setTickets(ticketRes.data.data);
        if (feedbackRes.data.success) setFeedback(feedbackRes.data.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const ticketsByStatus = {
    open: tickets.filter(t => t.status === 'OPEN').length,
    inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
    resolved: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
  };

  const recentTickets = tickets.slice(0, 5);
  const recentFeedback = feedback.slice(0, 5);

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="navbar-brand">
          <div className="navbar-logo">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#fff">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm3-7H9v2h6v-2z"/>
            </svg>
          </div>
          <span className="navbar-title">SupportFlow</span>
        </div>
        <div className="navbar-links">
          <a className="nav-link active" onClick={() => navigate('/dashboard')}>Dashboard</a>
          <a className="nav-link" onClick={() => navigate('/tickets')}>Tickets</a>
          <a className="nav-link" onClick={() => navigate('/feedback')}>Feedback</a>
        </div>
        <div className="navbar-user">
          <div className="navbar-avatar">{initials}</div>
          <span className="navbar-user-name">{user?.name}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl" style={{ padding: '32px 24px 60px' }}>
        <div className="welcome-card">
          <div className="welcome-glow" />
          <div className="welcome-top">
            <div className="big-avatar">{initials}</div>
            <div>
              <p className="welcome-label">Welcome to SupportFlow</p>
              <h1 className="welcome-name">Welcome, {user?.name}!</h1>
              <span style={{
                display: 'inline-block', padding: '4px 12px', borderRadius: 20,
                fontSize: 12, fontWeight: 600, letterSpacing: '.5px',
                background: roleStyle.bg, color: roleStyle.text, border: `1px solid ${roleStyle.border}`
              }}>
                Role: {getRole()?.replace('_', ' ')}
              </span>
            </div>
          </div>
          <div className="divider" />
          <p className="success-text">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#10b981" style={{ flexShrink: 0 }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            You are successfully logged in.
          </p>
        </div>

        <div className="cards-row">
          <div className="info-card">
            <div className="info-icon">🎫</div>
            <div className="info-value">{tickets.length}</div>
            <div className="info-label">Total Tickets</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🔓</div>
            <div className="info-value">{ticketsByStatus.open}</div>
            <div className="info-label">Open</div>
          </div>
          <div className="info-card">
            <div className="info-icon">🔄</div>
            <div className="info-value">{ticketsByStatus.inProgress}</div>
            <div className="info-label">In Progress</div>
          </div>
          <div className="info-card">
            <div className="info-icon">✅</div>
            <div className="info-value">{ticketsByStatus.resolved}</div>
            <div className="info-label">Resolved/Closed</div>
          </div>
        </div>

        <div className="cards-row" style={{ marginTop: '20px' }}>
          <div className="details-card">
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 20 }}>
              Recent Tickets
            </h2>
            {recentTickets.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No tickets yet.</p>
            ) : (
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Priority</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTickets.map(t => (
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.title}</td>
                      <td>
                        <span className="priority-badge" style={{
                          backgroundColor: PRIORITY_COLORS[t.priority]?.bg || PRIORITY_COLORS.MEDIUM.bg,
                          color: PRIORITY_COLORS[t.priority]?.text || PRIORITY_COLORS.MEDIUM.text,
                        }}>
                          {t.priority?.charAt(0) + t.priority?.slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge" style={{
                          backgroundColor: 'rgba(59,130,246,0.18)',
                          color: '#93c5fd',
                        }}>
                          {t.status?.replace('_', ' ').toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="details-card">
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 20 }}>
              Recent Feedback
            </h2>
            {recentFeedback.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>No feedback yet.</p>
            ) : (
              <table className="data-table compact">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Rating</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFeedback.map(f => (
                    <tr key={f.id}>
                      <td>{f.subject}</td>
                      <td>{f.rating !== null ? `★ ${f.rating}/5` : '—'}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{f.status?.toLowerCase()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="details-card" style={{ marginTop: '20px' }}>
          <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 600, color: '#e2e8f0', marginBottom: 20 }}>
            Session Details
          </h2>
          <div className="details-grid">
            {[
              { k: 'User ID', v: `#${user?.id}` },
              { k: 'Full Name', v: user?.name },
              { k: 'Email', v: user?.email },
              { k: 'Role', v: getRole()?.replace('_', ' ') },
            ].map(({ k, v }) => (
              <div key={k} className="detail-row">
                <span className="detail-key">{k}</span>
                <span className="detail-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
