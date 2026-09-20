import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const statusColors = {
  OPEN: '#3b82f6',
  IN_PROGRESS: '#f59e0b',
  RESOLVED: '#10b981',
  CLOSED: '#6b7280',
};

const priorityColors = {
  LOW: '#6366f1',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#b91c1c',
};

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, isAgent } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);

  const fetchTicket = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/tickets/${id}`);
      if (response.data.success) {
        setTicket(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load ticket');
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError('You do not have permission to view this ticket');
      } else {
        setError('Failed to load ticket');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setStatusLoading(true);
    try {
      const response = await api.put(`/tickets/${id}/status`, { status: newStatus });
      if (response.data.success) {
        setTicket(response.data.data);
      } else {
        setError(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
    setStatusLoading(false);
  };

  const canUpdateStatus = () => {
    if (!ticket) return false;
    if (isAdmin()) return true;
    if (isAgent() && ticket.assignedToId && ticket.assignedToId === ticket.assignedToId) return true;
    return false;
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <h3>Ticket not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Ticket #{ticket.id}</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--text-primary)' }}>{ticket.title}</h2>
            <span
              className="status-badge"
              style={{
                backgroundColor: `${statusColors[ticket.status] || statusColors.OPEN}20`,
                color: statusColors[ticket.status] || statusColors.OPEN,
              }}
            >
              {ticket.status?.replace('_', ' ')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span
              className="priority-badge"
              style={{
                backgroundColor: `${priorityColors[ticket.priority] || priorityColors.MEDIUM}20`,
                color: priorityColors[ticket.priority] || priorityColors.MEDIUM,
              }}
            >
              {ticket.priority?.charAt(0) + ticket.priority?.slice(1).toLowerCase()} Priority
            </span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Customer: {ticket.customerName}
            </span>
            {ticket.assignedToName && (
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Assigned to: {ticket.assignedToName}
              </span>
            )}
          </div>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Description</p>
            <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: '1.6' }}>{ticket.description}</p>
          </div>

          {ticket.resolvedAt && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Resolved on: {new Date(ticket.resolvedAt).toLocaleString()}
              </p>
            </div>
          )}

          {(isAdmin() || isAgent()) && (
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Update Status</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {STATUS_OPTIONS.map(status => (
                  <button
                    key={status}
                    className={`btn ${ticket.status === status ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                    onClick={() => handleStatusChange(status)}
                    disabled={statusLoading || ticket.status === status}
                  >
                    {status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Created: {new Date(ticket.createdAt).toLocaleString()}
            {ticket.updatedAt && ` · Updated: ${new Date(ticket.updatedAt).toLocaleString()}`}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button className="btn btn-ghost" onClick={() => navigate('/tickets')}>
          Back to Tickets
        </button>
      </div>
    </div>
  );
};

export default TicketDetail;
