import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@imovies.com');
      setPassword('admin123');
    } else {
      setEmail('user@imovies.com');
      setPassword('user123');
    }
    setError('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="im-card p-4 p-md-5 rounded-4 shadow-lg" style={{ background: '#12141e' }}>
            {/* Logo & Header */}
            <div className="text-center mb-4">
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-3 bg-danger text-white mb-2"
                style={{ width: '45px', height: '45px' }}
              >
                <i className="bi bi-film fs-4"></i>
              </span>
              <h3 className="text-white fw-bold">Sign In to IMovies</h3>
              <p className="text-secondary small">Access your bookings and reserve tickets seamlessly</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger py-2 small mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Email Address</label>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label text-secondary small fw-semibold mb-0">Password</label>
                </div>
                <div className="input-group">
                  <span className="input-group-text bg-dark border-secondary text-secondary">
                    <i className="bi bi-shield-lock"></i>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-dark border-secondary text-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-cinema w-100 py-2 fw-bold shadow mt-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Quick Fill Demo Credentials */}
            <div className="p-3 rounded-3 mb-4" style={{ background: '#0e1017', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div className="text-secondary small fw-bold mb-2 text-center text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                Quick Demo Accounts:
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm flex-grow-1"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => fillDemo('user')}
                >
                  <i className="bi bi-person me-1"></i> User Demo
                </button>
                <button
                  type="button"
                  className="btn btn-outline-warning btn-sm flex-grow-1"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => fillDemo('admin')}
                >
                  <i className="bi bi-shield-lock me-1"></i> Admin Demo
                </button>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center text-secondary small">
              Don't have an account?{' '}
              <Link to="/register" className="text-danger fw-semibold text-decoration-none">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
