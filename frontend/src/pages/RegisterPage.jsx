import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-5">
          <div className="im-card p-4 p-md-5 rounded-4 shadow-lg" style={{ background: '#12141e' }}>
            <div className="text-center mb-4">
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-3 bg-danger text-white mb-2"
                style={{ width: '45px', height: '45px' }}
              >
                <i className="bi bi-film fs-4"></i>
              </span>
              <h3 className="text-white fw-bold">Create Account</h3>
              <p className="text-secondary small">Join IMovies to book seats & earn loyalty perks</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small mb-4" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mb-4">
              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="e.g. Alex Johnson"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small fw-semibold">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
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

              <div className="mb-4">
                <label className="form-label text-secondary small fw-semibold">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-cinema w-100 py-2 fw-bold shadow"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="text-center text-secondary small">
              Already have an account?{' '}
              <Link to="/login" className="text-danger fw-semibold text-decoration-none">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
