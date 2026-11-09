import React, { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import '../../Styles/LoginPage.css';

function LoginPage({ onLoginSuccess }) {
  const { login, signUpAsUser, loading } = useAuth();
  const [mode, setMode] = useState('login'); // login, register-user
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register User fields
  const [registerUserFullName, setRegisterUserFullName] = useState('');
  const [registerUserEmail, setRegisterUserEmail] = useState('');
  const [registerUserPhoneNumber, setRegisterUserPhoneNumber] = useState('');
  const [registerUserPassword, setRegisterUserPassword] = useState('');
  const [registerUserConfirmPassword, setRegisterUserConfirmPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginEmail || !loginPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!loginEmail.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setError('');

    if (!registerUserFullName || !registerUserEmail || !registerUserPassword || !registerUserConfirmPassword || !registerUserPhoneNumber) {
      setError('Please fill in all fields');
      return;
    }

    if (!registerUserEmail.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    if (registerUserPassword !== registerUserConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerUserPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const result = await signUpAsUser(registerUserFullName, registerUserEmail, registerUserPassword, registerUserConfirmPassword, registerUserPhoneNumber);
    if (result.success && !result.noToken) {
      onLoginSuccess();
    } else if (result.success && result.noToken) {
      setError(result.message || 'Registration successful. Please log in with your credentials.');
      setMode('login');
      setRegisterUserFullName('');
      setRegisterUserEmail('');
      setRegisterUserPhoneNumber('');
      setRegisterUserPassword('');
      setRegisterUserConfirmPassword('');
      setLoginEmail(registerUserEmail);
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Ecommerce Application</h1>
           
          </div>

          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${mode === 'register-user' ? 'active' : ''}`}
              onClick={() => {
                setMode('register-user');
                setError('');
              }}
            >
              Register User
            </button>
          </div>

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          {mode === 'register-user' && (
            <form onSubmit={handleRegisterUser} className="login-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={registerUserFullName}
                  onChange={(e) => setRegisterUserFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={registerUserEmail}
                  onChange={(e) => setRegisterUserEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Enter your phone number"
                  value={registerUserPhoneNumber}
                  onChange={(e) => setRegisterUserPhoneNumber(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter your password"
                    value={registerUserPassword}
                    onChange={(e) => setRegisterUserPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={registerUserConfirmPassword}
                  onChange={(e) => setRegisterUserConfirmPassword(e.target.value)}
                />
              </div>

              {error && <div className="form-error">{error}</div>}

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Registering...' : 'Register as User'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

export default LoginPage;
