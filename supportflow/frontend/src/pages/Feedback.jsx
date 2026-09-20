import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'NEW', label: 'New' },
  { value: 'REVIEWED', label: 'Reviewed' },
  { value: 'ARCHIVED', label: 'Archived' },
];

const statusColors = {
  NEW: '#3b82f6',
  REVIEWED: '#10b981',
  ARCHIVED: '#6b7280',
};

const ratingColors = {
  5: '#10b981',
  4: '#84cc16',
  3: '#f59e0b',
  2: '#f97316',
  1: '#ef4444',
};

const Feedback = () => {
  const { user, isAdmin, isAgent } = useAuth();
  const [feedbackList, setFeedbackList] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: '',
    rating: 5,
    ticketId: null,
  });

  const fetchFeedback = async (status = '') => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (status) params.set('category', status);
      const url = `/feedback${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await api.get(url);
      if (response.data.success) {
        setFeedbackList(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load feedback');
      }
    } catch (err) {
      setError('Failed to load feedback');
    }
    setLoading(false);
  };

  const fetchTickets = async () => {
    try {
      const response = await api.get('/tickets');
      if (response.data.success) {
        setTickets(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load tickets for dropdown', err);
    }
  };

  useEffect(() => {
    fetchFeedback();
    if (isAdmin() || isAgent()) return;
    fetchTickets();
  }, []);

  const applyFilter = () => {
    fetchFeedback(statusFilter);
  };

  const resetFilter = () => {
    setStatusFilter('');
    fetchFeedback();
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      setError('Subject and description are required');
      return;
    }
    try {
      const response = await api.post('/feedback', formData);
      if (response.data.success) {
        setShowCreate(false);
        setFormData({ subject: '', description: '', category: '', rating: 5, ticketId: null });
        fetchFeedback(statusFilter);
      } else {
        setError(response.data.message || 'Failed to submit feedback');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const renderRating = (rating) => {
    if (!rating) return '—';
    return (
      <span style={{ color: ratingColors[rating] || '#6b7280', fontWeight: 600 }}>
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </span>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Feedback</h1>
        <p className="page-subtitle">
          {isAdmin() || isAgent()
            ? 'All customer feedback and satisfaction'
            : 'Your submitted feedback'}
        </p>
      </div>

      <div className="page-actions">
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
          Submit Feedback
        </button>
      </div>

      <div className="filter-bar">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <button className="btn btn-ghost btn-sm" onClick={applyFilter}>Apply</button>
        <button className="btn btn-ghost btn-sm" onClick={resetFilter}>Reset</button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {showCreate && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Submit Feedback</h2>
              <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <form onSubmit={handleCreate} className="modal-body">
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="What is this feedback about?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="Please provide details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. service, billing, feature"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Rating</label>
                  <select
                    className="form-input"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Good</option>
                    <option value={2}>2 - Fair</option>
                    <option value={1}>1 - Poor</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Related Ticket (optional)</label>
                <select
                  className="form-input"
                  value={formData.ticketId || ''}
                  onChange={(e) => setFormData({ ...formData, ticketId: e.target.value ? parseInt(e.target.value) : null })}
                >
                  <option value="">None</option>
                  {tickets.map(t => (
                    <option key={t.id} value={t.id}>#{t.id} - {t.title}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowCreate(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">Submit Feedback</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
        </div>
      ) : feedbackList.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <h3>No feedback found</h3>
          <p>No feedback matches your current filters.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Category</th>
                <th>Rating</th>
                {(isAdmin() || isAgent()) && <th>User</th>}
                <th>Ticket</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map(item => (
                <tr key={item.id}>
                  <td>{item.subject}</td>
                  <td>{item.category || '—'}</td>
                  <td>{renderRating(item.rating)}</td>
                  {(isAdmin() || isAgent()) && <td>{item.userName}</td>}
                  <td>{item.ticketTitle ? `#${item.ticketId}: ${item.ticketTitle.substring(0, 30)}` : '—'}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: `${statusColors[item.status] || statusColors.NEW}20`,
                        color: statusColors[item.status] || statusColors.NEW,
                      }}
                    >
                      {item.status?.toLowerCase()}
                    </span>
                  </td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Feedback;
