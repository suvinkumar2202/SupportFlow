import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-container">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm3-7H9v2h6v-2z"/>
            </svg>
          </div>
          <h1 className="app-name">SupportFlow</h1>
          <p className="app-subtitle">Customer Feedback & Escalation System</p>
        </div>

        {showRegister ? (
          <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm />
        )}

        <p className="register-prompt">
          {showRegister ? (
            <>
              Already have an account?{' '}
              <a
                href="#login"
                className="register-link"
                onClick={(e) => { e.preventDefault(); setShowRegister(false); }}
              >
                Sign In
              </a>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <a
                href="#register"
                className="register-link"
                onClick={(e) => { e.preventDefault(); setShowRegister(true); }}
              >
                Register
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
