import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) e.name = 'Full name is required';
    if (!email) e.email = 'Email address is required';
    else if (!emailRe.test(email)) e.email = 'Please enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setApiError('');
    setApiSuccess('');
    if (!validate()) return;

    setLoading(true);
    const result = await register(name.trim(), email, password);
    setLoading(false);

    if (result.success) {
      setApiSuccess(result.message || 'Registration successful');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 800);
    } else {
      setApiError(result.message);
    }
  };

  const clearFieldError = (field) =>
    setErrors(prev => ({ ...prev, [field]: '' }));

  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* API Success */}
      {apiSuccess && (
        <div className="alert alert-success" id="api-success-alert">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>{apiSuccess}</span>
        </div>
      )}

      {/* API Error */}
      {apiError && (
        <div className="alert alert-danger" id="api-error-alert">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>{apiError}</span>
        </div>
      )}

      {/* Full Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="register-name-input">Full Name</label>
        <div className="input-container">
          <input
            type="text"
            id="register-name-input"
            className={`form-input${errors.name ? ' error-border' : ''}`}
            placeholder="Suvin Kumar"
            value={name}
            onChange={e => { setName(e.target.value); clearFieldError('name'); }}
            disabled={loading}
            autoComplete="name"
          />
        </div>
        {errors.name && <span className="input-feedback" id="name-error">{errors.name}</span>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label" htmlFor="register-email-input">Email Address</label>
        <div className="input-container">
          <input
            type="email"
            id="register-email-input"
            className={`form-input${errors.email ? ' error-border' : ''}`}
            placeholder="suvin123@gmail.com"
            value={email}
            onChange={e => { setEmail(e.target.value); clearFieldError('email'); }}
            disabled={loading}
            autoComplete="email"
          />
        </div>
        {errors.email && <span className="input-feedback" id="email-error">{errors.email}</span>}
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="form-label" htmlFor="register-password-input">Password</label>
        <div className="input-container">
          <input
            type={showPass ? 'text' : 'password'}
            id="register-password-input"
            className={`form-input${errors.password ? ' error-border' : ''}`}
            placeholder="••••••••"
            value={password}
            onChange={e => { setPassword(e.target.value); clearFieldError('password'); }}
            disabled={loading}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPass(v => !v)}
            aria-label={showPass ? 'Hide password' : 'Show password'}
            disabled={loading}
          >
            {showPass ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.2 2.7-2.78 3.44-4.74C21.27 7.61 17 4.5 12 4.5c-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zm4.53 5.53 1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            )}
          </button>
        </div>
        {errors.password && <span className="input-feedback" id="password-error">{errors.password}</span>}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label className="form-label" htmlFor="register-confirm-input">Confirm Password</label>
        <div className="input-container">
          <input
            type={showConfirm ? 'text' : 'password'}
            id="register-confirm-input"
            className={`form-input${errors.confirmPassword ? ' error-border' : ''}`}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword'); }}
            disabled={loading}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirm(v => !v)}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            disabled={loading}
          >
            {showConfirm ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.2 2.7-2.78 3.44-4.74C21.27 7.61 17 4.5 12 4.5c-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zm4.53 5.53 1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && <span className="input-feedback" id="register-confirm-error">{errors.confirmPassword}</span>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="login-btn"
        id="register-submit-button"
        disabled={loading}
      >
        {loading ? <div className="spinner" id="register-loading-spinner"></div> : 'Create Account'}
      </button>
    </form>
  );
};

export default RegisterForm;
