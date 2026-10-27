import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-top border-dark mt-5 pt-5 pb-4" style={{ background: '#08090c' }}>
      <div className="container">
        <div className="row g-4 justify-content-between">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-3 bg-danger text-white"
                style={{ width: '34px', height: '34px' }}
              >
                <i className="bi bi-film fs-5"></i>
              </span>
              <span className="fs-4 fw-bold text-white">
                I<span className="text-danger">Movies</span>
              </span>
            </div>
            <p className="text-secondary small pe-lg-4">
              Movie ticket booking made simple. Discover trending releases, reserve your preferred seats with live seat matrix tracking, and enjoy seamless cinema experiences.
            </p>
            <div className="d-flex gap-3 text-secondary fs-5 mt-3">
              <a href="#facebook" className="text-secondary hover-text-white"><i className="bi bi-facebook"></i></a>
              <a href="#twitter" className="text-secondary hover-text-white"><i className="bi bi-twitter-x"></i></a>
              <a href="#instagram" className="text-secondary hover-text-white"><i className="bi bi-instagram"></i></a>
              <a href="#youtube" className="text-secondary hover-text-white"><i className="bi bi-youtube"></i></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small" style={{ letterSpacing: '1px' }}>Explore</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/?status=now-showing" className="text-secondary text-decoration-none hover-text-white">Now Showing</Link></li>
              <li><Link to="/?status=coming-soon" className="text-secondary text-decoration-none hover-text-white">Coming Soon</Link></li>
              <li><Link to="/my-bookings" className="text-secondary text-decoration-none hover-text-white">My Bookings</Link></li>
              <li><Link to="/login" className="text-secondary text-decoration-none hover-text-white">Sign In</Link></li>
            </ul>
          </div>

          {/* Cinema Experiences */}
          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small" style={{ letterSpacing: '1px' }}>Formats & Perks</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small text-secondary">
              <li><i className="bi bi-badge-hd text-danger me-2"></i>IMAX 3D Laser</li>
              <li><i className="bi bi-soundwave text-danger me-2"></i>Dolby Atmos 7.1</li>
              <li><i className="bi bi-layers text-danger me-2"></i>4DX Motion Chairs</li>
              <li><i className="bi bi-cup-straw text-danger me-2"></i>Gourmet Food Ordering</li>
            </ul>
          </div>

          {/* 24/7 Support */}
          <div className="col-lg-3 col-md-6">
            <h6 className="text-white fw-bold mb-3 text-uppercase small" style={{ letterSpacing: '1px' }}>Help & Support</h6>
            <div className="p-3 rounded-3" style={{ background: '#12141c', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div className="d-flex align-items-center gap-2 text-danger fw-semibold small mb-1">
                <i className="bi bi-headset fs-5"></i> 24/7 Customer Care
              </div>
              <p className="text-secondary mb-2" style={{ fontSize: '0.8rem' }}>
                Need help with a booking or cancellation?
              </p>
              <div className="text-white fw-bold small">support@imovies.com</div>
              <div className="text-secondary small">+1 (800) 466-8437</div>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary opacity-25" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-secondary">
          <div>
            &copy; {new Date().getFullYear()} IMovies Entertainment Inc. All rights reserved.
          </div>
          <div className="d-flex gap-3">
            <span>Built with MERN Stack & Bootstrap</span>
            <span>•</span>
            <span className="text-success"><i className="bi bi-shield-check me-1"></i>Secure SSL Booking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
