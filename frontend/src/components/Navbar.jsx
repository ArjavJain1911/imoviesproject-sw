import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark im-glass sticky-top py-2 px-3 border-bottom border-dark">
      <div className="container-fluid px-lg-4">
        {/* Brand Logo */}
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-4 text-white" to="/">
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-3 bg-danger text-white shadow-sm"
            style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #e50914, #ff2e43)' }}
          >
            <i className="bi bi-film fs-5"></i>
          </span>
          <span style={{ letterSpacing: '0.5px' }}>
            I<span className="text-danger">Movies</span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#imoviesNavbar"
          aria-controls="imoviesNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="imoviesNavbar">
          {/* Search Bar */}
          <form className="d-flex my-2 my-lg-0 mx-lg-4 flex-grow-1" style={{ maxWidth: '450px' }} onSubmit={handleSearchSubmit}>
            <div className="input-group">
              <span className="input-group-text bg-dark border-secondary text-secondary">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="search"
                className="form-control bg-dark text-white border-secondary"
                placeholder="Search movies, genres, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ fontSize: '0.9rem' }}
              />
            </div>
          </form>

          {/* Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
            <li className="nav-item">
              <Link className="nav-link text-white-50 hover-text-white fw-medium" to="/">
                <i className="bi bi-play-circle me-1"></i> Movies
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link className="nav-link text-white-50 hover-text-white fw-medium" to="/my-bookings">
                  <i className="bi bi-ticket-perforated me-1 text-danger"></i> My Bookings
                </Link>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <Link className="nav-link text-warning fw-semibold" to="/admin">
                  <i className="bi bi-speedometer2 me-1"></i> Admin Panel
                </Link>
              </li>
            )}
          </ul>

          {/* Auth Section */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-dark border-secondary d-flex align-items-center gap-2 rounded-pill px-3 py-1"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}
                  >
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="text-white small fw-medium">{user?.name}</span>
                  <i className="bi bi-chevron-down text-secondary small"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark shadow-lg border-secondary" aria-labelledby="userDropdown">
                  <li className="dropdown-header text-muted small">
                    Signed in as <strong>{user?.email}</strong>
                  </li>
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <Link className="dropdown-item d-flex align-items-center gap-2" to="/my-bookings">
                      <i className="bi bi-ticket-detailed text-danger"></i> My Tickets
                    </Link>
                  </li>
                  {isAdmin && (
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2 text-warning" to="/admin">
                        <i className="bi bi-shield-lock"></i> Admin Dashboard
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider border-secondary" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger d-flex align-items-center gap-2"
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                    >
                      <i className="bi bi-box-arrow-right"></i> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-cinema-outline btn-sm">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-cinema btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
