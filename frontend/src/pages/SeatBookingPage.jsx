import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { showsAPI } from '../services/api';
import { useBooking } from '../context/BookingContext';
import SeatPicker from '../components/SeatPicker';

const SeatBookingPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const {
    selectedShow,
    selectedSeats,
    toggleSeat,
    setBookingSession,
    seatsSubtotal,
  } = useBooking();

  const [show, setShow] = useState(selectedShow || null);
  const [loading, setLoading] = useState(!selectedShow);
  const [error, setError] = useState('');

  // Fetch or refresh show data to ensure latest booked seats state
  useEffect(() => {
    const fetchShowDetails = async () => {
      try {
        setLoading(true);
        const res = await showsAPI.getById(showId);
        if (res.data.success) {
          setShow(res.data.data);
          if (!selectedShow) {
            setBookingSession(res.data.data, res.data.data.movie);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load show details');
      } finally {
        setLoading(false);
      }
    };

    fetchShowDetails();
  }, [showId]);

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least 1 seat to proceed.');
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-secondary mt-3">Loading interactive seat matrix...</p>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="container py-5 text-center my-5">
        <h4 className="text-white">Unable to load show</h4>
        <p className="text-secondary">{error || 'Show details not available.'}</p>
        <button className="btn btn-cinema" onClick={() => navigate('/')}>
          Return to Movies
        </button>
      </div>
    );
  }

  const movie = show.movie;
  const theater = show.theater;

  return (
    <div className="container py-4">
      {/* Header Info Bar */}
      <div className="im-glass p-3 p-md-4 rounded-4 mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div className="d-flex align-items-center gap-3">
          <img
            src={movie?.posterUrl}
            alt={movie?.title}
            className="rounded-3 shadow-sm border border-secondary"
            style={{ width: '60px', height: '85px', objectFit: 'cover' }}
          />
          <div>
            <h5 className="text-white fw-bold mb-1">{movie?.title}</h5>
            <div className="text-secondary small d-flex flex-wrap align-items-center gap-2">
              <span><i className="bi bi-geo-alt text-danger me-1"></i>{theater?.name}</span>
              <span>•</span>
              <span className="badge bg-danger bg-opacity-25 text-danger">{show.screenName} ({show.format})</span>
              <span>•</span>
              <span><i className="bi bi-calendar3 me-1"></i>{show.date}</span>
              <span>•</span>
              <span className="text-white fw-semibold"><i className="bi bi-clock me-1"></i>{show.time}</span>
            </div>
          </div>
        </div>

        <button
          className="btn btn-cinema-outline btn-sm align-self-start align-self-md-center"
          onClick={() => navigate(`/movie/${movie?._id}`)}
        >
          <i className="bi bi-arrow-left me-1"></i> Change Showtime
        </button>
      </div>

      <div className="row g-4">
        {/* Main Seat Layout Matrix */}
        <div className="col-lg-8">
          <SeatPicker
            show={show}
            selectedSeats={selectedSeats}
            onToggleSeat={toggleSeat}
          />
        </div>

        {/* Booking Summary Sidebar */}
        <div className="col-lg-4">
          <div className="im-card p-4 rounded-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="text-white fw-bold mb-3 border-bottom border-dark pb-2 d-flex justify-content-between align-items-center">
              <span>Booking Summary</span>
              <span className="badge bg-danger">{selectedSeats.length} Seats</span>
            </h5>

            {/* Selected Seats Badges */}
            <div className="mb-4">
              <label className="text-secondary small mb-2 d-block">Selected Seats:</label>
              {selectedSeats.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.seatNumber}
                      className="badge bg-dark border border-danger text-white p-2 d-flex align-items-center gap-2"
                    >
                      <span className="fw-bold">{s.seatNumber}</span>
                      <span className="text-warning small" style={{ fontSize: '0.7rem' }}>
                        ({s.tier} • ₹{s.price})
                      </span>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        style={{ fontSize: '0.55rem' }}
                        aria-label="Remove seat"
                        onClick={() => toggleSeat(s.seatNumber, s.tier, s.price)}
                      ></button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded-3 text-center text-secondary small" style={{ background: '#0e1017' }}>
                  <i className="bi bi-hand-index-thumb fs-4 d-block mb-1 text-danger"></i>
                  Click on any available seat on the screen map to select.
                </div>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="d-flex flex-column gap-2 small mb-4 border-top border-dark pt-3">
              <div className="d-flex justify-content-between text-secondary">
                <span>Tickets Subtotal</span>
                <span className="text-white fw-semibold">₹{seatsSubtotal}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary">
                <span>Convenience Fee (₹30/seat)</span>
                <span className="text-white fw-semibold">
                  ₹{selectedSeats.length > 0 ? selectedSeats.length * 30 : 0}
                </span>
              </div>
              <div className="d-flex justify-content-between text-white fw-bold fs-6 border-top border-dark pt-2 mt-1">
                <span>Estimated Total</span>
                <span className="text-danger fs-5">
                  ₹{seatsSubtotal + (selectedSeats.length > 0 ? selectedSeats.length * 30 : 0)}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              className="btn btn-cinema w-100 py-3 fw-bold d-flex justify-content-center align-items-center gap-2 shadow"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToCheckout}
            >
              <span>Proceed to Checkout</span>
              <i className="bi bi-arrow-right"></i>
            </button>

            <div className="text-center mt-3 text-secondary" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-shield-check text-success me-1"></i>
              Seats temporarily held for 10 minutes during checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatBookingPage;
