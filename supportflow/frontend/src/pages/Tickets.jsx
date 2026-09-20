import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

const priorityColors = {
  LOW: '#6366f1',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#b91c1c',
};

const statusColors = {
  OPEN: '#3b82f6',
  IN_PROGRESS: '#f59e0b',
  RESOLVED: '#10b981',
  CLOSED: '#6b7280',
};

const Tickets = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isAgent } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM' });

  const fetchTickets = async (statusFilter = '', priorityFilter = '') => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('priority', priorityFilter);
      const query = params.toString();
      const url = `/tickets${query ? `?${query}` : ''}`;
      const response = await api.get(url);
      if (response.data.success) {
        setTickets(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load tickets');
      }
    } catch (err) {
      setError('Failed to load tickets');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const applyFilters = () => {
    fetchTickets(filters.status, filters.priority);
  };

  const resetFilters = () => {
    setFilters({ status: '', priority: '' });
    fetchTickets();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required');
      return;
    }
    try {
      const response = await api.post('/tickets', formData);
      if (response.data.success) {
        setShowCreate(false);
        setFormData({ title: '', description: '', priority: 'MEDIUM' });
        fetchTickets(filters.status, filters.priority);
      } else {
        setError(response.data.message || 'Failed to create ticket');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ticket');
    }
  };

  const getStatusLabel = (status) => status?.replace('_', ' ') || 'Unknown';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Tickets</h1>
        <p className="page-subtitle">
          {isAdmin() ? 'View all support tickets' :
           isAgent() ? 'Tickets assigned to you' :
           'Your submitted tickets'}
        </p>
      </div>

      <div className="page-actions">
        <button
          className="btn btn-primary"
          onClick={() => setShowCreate(true)}
        >
          <span>+ New Ticket</span>
        </button>
      </div>

      <div className="filter-bar">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="filter-select"
        >
          {PRIORITY_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={applyFilters}>Apply</button>
        <button className="btn btn-ghost btn-sm" onClick={resetFilters}>Reset</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showCreate && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Create New Ticket</h2>
              <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate} className="modal-body">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Brief summary of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="Detailed description of the issue"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-input"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  {PRIORITY_OPTIONS.slice(1).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Create Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <h3>No tickets found</h3>
          <p>No tickets match your current filters.</p>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            Create your first ticket
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                {isAdmin() && <th>Customer</th>}
                {(isAdmin() || isAgent()) && <th>Assigned To</th>}
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} onClick={() => navigate(`/tickets/${ticket.id}`)} style={{ cursor: 'pointer' }}>
                  <td>{ticket.id}</td>
                  <td>{ticket.title}</td>
                  <td>
                    <span className="priority-badge" style={{ backgroundColor: `${priorityColors[ticket.priority]}20`, color: priorityColors[ticket.priority] }}>
                      {ticket.priority?.charAt(0) + ticket.priority?.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge" style={{ backgroundColor: `${statusColors[ticket.status]}20`, color: statusColors[ticket.status] }}>
                      {getStatusLabel(ticket.status)}
                    </span>
                  </td>
                  {isAdmin() && <td>{ticket.customerName}</td>}
                  {(isAdmin() || isAgent()) && <td>{ticket.assignedToName || '—'}</td>}
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${ticket.id}`); }}
                    >
                      View
                    </button>
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

export default Tickets;
