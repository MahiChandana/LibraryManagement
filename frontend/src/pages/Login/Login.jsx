import React, { useState } from 'react';
import authService from '../../services/authService';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState('LIBRARIAN'); // LIBRARIAN or USER
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const demoCredentials = {
    LIBRARIAN: {
      email: 'librarian@library.com',
      password: 'admin123',
      role: 'LIBRARIAN'
    },
    USER: {
      email: 'user@library.com',
      password: 'user123',
      role: 'USER'
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setEmail('');
    setPassword('');
    setErrors({});
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleAutoFill = () => {
    const creds = demoCredentials[selectedRole];
    setEmail(creds.email);
    setPassword(creds.password);
    setErrors({});
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setName('');
    setEmail('');
    setPassword('');
    setErrors({});
    setErrorMsg('');
    setSuccessMsg('');
    if (isSignUp) {
      setSelectedRole('USER');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (isSignUp && !name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (isSignUp && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!validate()) return;

    try {
      setLoading(true);
      if (isSignUp) {
        await authService.register(name, email, password);
        setSuccessMsg("Account created successfully! Logging you in...");
        setTimeout(() => {
          onLoginSuccess();
        }, 1500);
      } else {
        const user = await authService.login(email, password);
        // Verify role matches selected tab just to be secure/consistent
        if (user.role !== selectedRole) {
          throw new Error(`This email is registered as a ${user.role}. Please select the correct tab.`);
        }
        onLoginSuccess();
      }
    } catch (err) {
      console.error("Authentication failed:", err);
      setErrorMsg(err.message || "Authentication failed. Please verify details.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        
        {/* Left Side: Brand and Quick Cards */}
        <div className="login-branding">
          <div className="brand-header">
            <span className="brand-logo">📚</span>
            <h1 className="brand-title">LibFlow</h1>
            <p className="brand-tagline">Premium Library Management Experience</p>
          </div>

          <div className="demo-cards-wrapper">
            <h3>Quick Demo Access</h3>
            <div className="demo-card clickable" onClick={() => { if (isSignUp) handleToggleMode(); handleRoleChange('LIBRARIAN'); }}>
              <div className="demo-card-badge librarian">LIBRARIAN</div>
              <div className="demo-card-body">
                <p><strong>Email:</strong> librarian@library.com</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>

            <div className="demo-card clickable" onClick={() => { if (isSignUp) handleToggleMode(); handleRoleChange('USER'); }}>
              <div className="demo-card-badge user">USER</div>
              <div className="demo-card-body">
                <p><strong>Email:</strong> user@library.com</p>
                <p><strong>Password:</strong> user123</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="login-form-wrapper card">
          <h2 className="form-title">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="form-subtitle">{isSignUp ? 'Join LibFlow to explore and borrow books' : 'Choose your workspace to sign in'}</p>

          {/* Role selector tabs - only shown in Sign In mode */}
          {!isSignUp && (
            <div className="role-selector-tabs">
              <button 
                type="button" 
                className={`role-tab ${selectedRole === 'LIBRARIAN' ? 'active' : ''}`}
                onClick={() => handleRoleChange('LIBRARIAN')}
              >
                💼 Librarian
              </button>
              <button 
                type="button" 
                className={`role-tab ${selectedRole === 'USER' ? 'active' : ''}`}
                onClick={() => handleRoleChange('USER')}
              >
                👥 Member / User
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger login-alert">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert alert-success login-alert">
              <span>✨ {successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="form-group">
                <label className="form-label" htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  disabled={loading}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                placeholder="Enter email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                disabled={loading}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                disabled={loading}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-actions">
              {!isSignUp && (
                <button 
                  type="button" 
                  className="btn btn-secondary fill-btn" 
                  onClick={handleAutoFill}
                  disabled={loading}
                >
                  ⚡ Auto-Fill Demo
                </button>
              )}
              <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading}>
                {loading ? (isSignUp ? 'Signing Up...' : 'Signing In...') : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </div>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="login-toggle-mode">
            {isSignUp ? (
              <p>Already have an account? <span className="toggle-link" onClick={handleToggleMode}>Sign In</span></p>
            ) : (
              <p>New to LibFlow? <span className="toggle-link" onClick={handleToggleMode}>Sign Up</span></p>
            )}
          </div>

          {/* Display demo credentials below the form based on selection (only in Sign In mode) */}
          {!isSignUp && (
            <div className="selected-demo-info">
              <span className="info-title">Workspace Demo Account:</span>
              <code>
                <strong>Role:</strong> {demoCredentials[selectedRole].role}<br/>
                <strong>Email:</strong> {demoCredentials[selectedRole].email}<br/>
                <strong>Password:</strong> {demoCredentials[selectedRole].password}
              </code>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;
