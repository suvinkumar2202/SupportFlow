import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = () => {
  const { login }   = useAuth();
  const navigate    = useNavigate();

  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [rememberMe,  setRememberMe]  = useState(false);
  const [errors,      setErrors]      = useState({});
  const [apiError,    setApiError]    = useState('');
  const [loading,     setLoading]     = useState(false);

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email)               e.email    = 'Email address is required';
    else if (!emailRe.test(email)) e.email = 'Please enter a valid email address';
    if (!password)            e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;

    setLoading(true);
    const result = await login(email, password, rememberMe);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setApiError(result.message);
    }
  };

  const clearFieldError = (field) =>
    setErrors(prev => ({ ...prev, [field]: '' }));

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} noValidate>

      {/* API Error */}
      {apiError && (
        <div className="alert alert-danger" id="api-error-alert">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>{apiError}</span>
        </div>
      )}

      {/* Email */}
      <div className="form-group">
        <label className="form-label" htmlFor="email-input">Email Address</label>
        <div className="input-container">
          <input
            type="email"
            id="email-input"
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
        <label className="form-label" htmlFor="password-input">Password</label>
        <div className="input-container">
          <input
            type={showPass ? 'text' : 'password'}
            id="password-input"
            className={`form-input${errors.password ? ' error-border' : ''}`}
            placeholder="••••••••"
            value={password}
            onChange={e => { setPassword(e.target.value); clearFieldError('password'); }}
            disabled={loading}
            autoComplete="current-password"
          />
          <button
            type="button"
            className="password-toggle"
            id="toggle-password-btn"
            onClick={() => setShowPass(v => !v)}
            aria-label={showPass ? 'Hide password' : 'Show password'}
            disabled={loading}
          >
            {showPass ? (
              /* eye-off */
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.2 2.7-2.78 3.44-4.74C21.27 7.61 17 4.5 12 4.5c-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zm4.53 5.53 1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            ) : (
              /* eye */
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            )}
          </button>
        </div>
        {errors.password && <span className="input-feedback" id="password-error">{errors.password}</span>}
      </div>

      {/* Helpers */}
      <div className="form-helpers">
        <label className="remember-me" htmlFor="remember-me-checkbox">
          <input
            type="checkbox"
            id="remember-me-checkbox"
            checked={rememberMe}
            onChange={e => setRememberMe(e.target.checked)}
            disabled={loading}
          />
          <span>Remember me</span>
        </label>
        <a href="#forgot" className="forgot-password" onClick={e => e.preventDefault()}>
          Forgot Password?
        </a>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="login-btn"
        id="login-submit-button"
        disabled={loading}
      >
        {loading ? <div className="spinner" id="login-loading-spinner"></div> : 'Sign In'}
      </button>
    </form>
  );
};

export default LoginForm;
