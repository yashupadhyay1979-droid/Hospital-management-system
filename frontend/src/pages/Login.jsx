import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff, Lock, User, AlertCircle, ArrowRight, Stethoscope } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // slight delay for UX feel
    await new Promise((r) => setTimeout(r, 800));

    const result = login(username, password);
    if (result.success) {
      navigate('/', { replace: true });
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  const quickLogin = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="login-root">
      {/* Animated blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="login-container">
        {/* Left branding panel */}
        <div className="login-brand">
          <div className="login-brand-inner">
            <div className="brand-logo-wrap">
              <div className="brand-logo-icon">
                <Activity size={36} strokeWidth={2.5} />
              </div>
              <div className="pulse-ring" />
            </div>

            <h1 className="brand-name">ASPATAL</h1>
            <p className="brand-tagline">Advanced Hospital Management System</p>

            <div className="brand-features">
              {[
                { icon: '🏥', text: 'Complete Patient Management' },
                { icon: '🔬', text: 'Lab & EMR Integration' },
                { icon: '📡', text: 'HL7 / MLLP Engine' },
                { icon: '📊', text: 'Real-time Analytics' },
              ].map((f, i) => (
                <div key={i} className="brand-feature-item">
                  <span className="brand-feature-emoji">{f.icon}</span>
                  <span>{f.text}</span>
                </div>
              ))}
            </div>

            <div className="brand-stats">
              {[
                { val: '99.9%', label: 'Uptime' },
                { val: 'HL7 v2.x', label: 'Standard' },
                { val: 'HIPAA', label: 'Compliant' },
              ].map((s, i) => (
                <div key={i} className="brand-stat">
                  <span className="brand-stat-val">{s.val}</span>
                  <span className="brand-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="login-form-panel">
          <div className="login-form-card">
            <div className="form-header">
              <div className="form-header-icon">
                <Stethoscope size={22} />
              </div>
              <h2 className="form-title">Welcome Back</h2>
              <p className="form-subtitle">Sign in to access your HMS dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <div className="input-wrap">
                  <User className="input-icon" size={18} />
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="form-input"
                    required
                    autoFocus
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-wrap">
                  <Lock className="input-icon" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="form-input"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="input-eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="form-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? (
                  <span className="login-btn-loading">
                    <span className="spinner" />
                    Authenticating...
                  </span>
                ) : (
                  <span className="login-btn-text">
                    Sign In
                    <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </form>

            {/* Demo credentials */}
            <div className="demo-creds">
              <p className="demo-creds-title">🔑 Demo Credentials</p>
              <div className="demo-creds-grid">
                {[
                  { role: 'Admin', user: 'admin', pass: 'admin123', color: 'cred-blue' },
                  { role: 'Doctor', user: 'doctor', pass: 'doctor123', color: 'cred-green' },
                  { role: 'Nurse', user: 'nurse', pass: 'nurse123', color: 'cred-purple' },
                ].map((c) => (
                  <button
                    key={c.role}
                    type="button"
                    className={`cred-chip ${c.color}`}
                    onClick={() => quickLogin(c.user, c.pass)}
                  >
                    <span className="cred-role">{c.role}</span>
                    <span className="cred-user">{c.user}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="login-footer-text">
              ASPATAL HMS v2.0 &bull; Powered by Spring Boot + React
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
