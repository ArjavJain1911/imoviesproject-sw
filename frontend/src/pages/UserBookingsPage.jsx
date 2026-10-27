import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../services/api';

const UserBookingsPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await bookingsAPI.getMyBookings();
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('[UserBookings] Error fetching bookings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id, bookingId) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${bookingId}? Seats will be released immediately.`)) {
      return;
    }

    try {
      setCancellingId(id);
      const res = await bookingsAPI.cancel(id);
      if (res.data.success) {
        setMessage(`Booking ${bookingId} has been successfully cancelled.`);
        // Refresh bookings list
        await fetchBookings();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-dark">
        <div>
          <h2 className="text-white fw-bold mb-1">
            <i className="bi bi-ticket-perforated-fill text-danger me-2"></i> My Booking History
          </h2>
          <p className="text-secondary small mb-0">View, download tickets, or manage your cinema reservations</p>
        </div>
        <Link to="/" className="btn btn-cinema btn-sm">
          <i className="bi bi-plus-lg me-1"></i> Book New Movie
        </Link>
      </div>

      {message && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {message}
          <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-danger" role="status"></div>
          <p className="text-secondary mt-3">Retrieving your bookings...</p>
        </div>
      ) : bookings.length > 0 ? (
        <div className="row g-4">
          {bookings.map((booking) => {
            const isCancelled = booking.status === 'cancelled';
            return (
              <div key={booking._id} className="col-lg-6">
                <div
                  className={`im-card p-4 rounded-4 h-100 d-flex flex-column justify-content-between position-relative ${
                    isCancelled ? 'opacity-75' : ''
                  }`}
                  style={{ background: '#12141e' }}
                >
                  <div>
                    {/* Top row: Booking ID & Status */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-dark border border-secondary text-light px-2 py-1">
                        ID: {booking.bookingId}
                      </span>
                      <span
                        className={`badge text-uppercase px-2 py-1 ${
                          isCancelled ? 'bg-secondary' : 'bg-success'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    {/* Movie Info */}
                    <div className="d-flex gap-3 align-items-center mb-3">
                      <img
                        src={booking.movie?.posterUrl}
                        alt={booking.movie?.title}
                        className="rounded-3 border border-secondary shadow-sm"
                        style={{ width: '70px', height: '100px', objectFit: 'cover' }}
                      />
                      <div>
                        <h5 className="text-white fw-bold mb-1">{booking.movie?.title}</h5>
                        <div className="text-secondary small mb-1">
                          <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                          {booking.theater?.name}
                        </div>
                        <div className="d-flex flex-wrap gap-2 text-white small">
                          <span className="badge bg-danger bg-opacity-25 text-danger">{booking.format}</span>
                          <span className="text-secondary">{booking.showDate}</span>
                          <span className="text-warning fw-semibold">{booking.showTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Seats & Price */}
                    <div className="p-3 rounded-3 mb-3" style={{ background: '#0e1017' }}>
                      <div className="d-flex justify-content-between align-items-center text-secondary small mb-1">
                        <span>Reserved Seats:</span>
                        <span className="text-white fw-bold">
                          {booking.seats?.map((s) => s.seatNumber).join(', ')}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between align-items-center text-secondary small">
                        <span>Total Paid:</span>
                        <span className="text-danger fw-bold fs-6">₹{booking.totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex justify-content-between align-items-center pt-2 border-top border-dark gap-2">
                    <button
                      className="btn btn-cinema-outline btn-sm"
                      onClick={() => navigate(`/confirmation/${booking._id}`, { state: { booking } })}
                    >
                      <i className="bi bi-qr-code me-1"></i> View Ticket Pass
                    </button>

                    {!isCancelled && (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={cancellingId === booking._id}
                        onClick={() => handleCancelBooking(booking._id, booking.bookingId)}
                      >
                        {cancellingId === booking._id ? (
                          <span className="spinner-border spinner-border-sm" role="status"></span>
                        ) : (
                          <>
                            <i className="bi bi-x-circle me-1"></i> Cancel Booking
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5 p-5 rounded-4" style={{ background: '#12141e', border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
          <i className="bi bi-ticket-detailed display-3 text-secondary mb-3 d-block"></i>
          <h4 className="text-white fw-bold">No bookings found yet</h4>
          <p className="text-secondary small mb-4">
            You haven't reserved any movie tickets yet. Explore movies and book your first show!
          </p>
          <Link to="/" className="btn btn-cinema">
            Browse Movies Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;
