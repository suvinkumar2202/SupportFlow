import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, getRole, isAdmin, isAgent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'SF';

  const isActive = (path) => location.pathname === path;

  return (
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
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Dashboard
        </NavLink>
        <NavLink to="/tickets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Tickets
        </NavLink>
        <NavLink to="/feedback" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          Feedback
        </NavLink>
        {(isAdmin() || isAgent()) && (
          <NavLink to="/agents" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Agents
          </NavLink>
        )}
        {isAdmin() && (
          <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            User Management
          </NavLink>
        )}
      </div>

      <div className="navbar-user">
        <div className="navbar-avatar">{initials}</div>
        <span className="navbar-user-name">{user?.name}</span>
        <span className={`role-badge role-${getRole()?.toLowerCase()}`}>{getRole()?.replace('_', ' ')}</span>
        <button className="logout-btn" onClick={handleLogout}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
