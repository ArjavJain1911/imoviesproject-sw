import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { bookingsAPI } from '../services/api';

const BookingConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState('');

  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#e50914', '#ffb703', '#ffffff', '#22c55e'],
    });

    // If booking was not passed in state, fetch by ID
    if (!booking && id) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await bookingsAPI.getById(id);
          if (res.data.success) {
            setBooking(res.data.data);
          }
        } catch (err) {
          setError(err.message || 'Failed to retrieve booking ticket details');
        } finally {
          setLoading(false);
        }
      };
      fetchBooking();
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-5 text-center my-5">
        <div className="spinner-border text-danger" role="status"></div>
        <p className="text-secondary mt-3">Loading ticket confirmation...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container py-5 text-center my-5">
        <h4 className="text-white">Ticket Not Found</h4>
        <p className="text-secondary">{error || 'Unable to retrieve ticket.'}</p>
        <Link to="/" className="btn btn-cinema mt-2">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4 my-2">
      {/* Success Notification */}
      <div className="text-center mb-4">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success bg-opacity-25 text-success p-3 mb-2"
          style={{ width: '64px', height: '64px' }}
        >
          <i className="bi bi-check-circle-fill fs-2"></i>
        </div>
        <h2 className="text-white fw-bold">Booking Confirmed!</h2>
        <p className="text-secondary small">
          Your reservation is verified. An electronic confirmation has been generated below.
        </p>
      </div>

      {/* Digital Cinema Ticket Card */}
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-9">
          <div className="ticket-container shadow-2xl p-4 p-md-5 mb-4 position-relative">
            <div className="ticket-cutout-left"></div>
            <div className="ticket-cutout-right"></div>

            {/* Ticket Header */}
            <div className="d-flex justify-content-between align-items-center border-bottom border-dark pb-3 mb-4">
              <div className="d-flex align-items-center gap-2">
                <span className="p-2 rounded-3 bg-danger text-white">
                  <i className="bi bi-film fs-5"></i>
                </span>
                <div>
                  <h5 className="text-white fw-bold mb-0">I<span className="text-danger">Movies</span> Pass</h5>
                  <span className="text-secondary small">Electronic Cinema Ticket</span>
                </div>
              </div>
              <div className="text-end">
                <span className="badge bg-success text-uppercase px-2 py-1">
                  {booking.status}
                </span>
                <div className="text-secondary small mt-1">ID: {booking.bookingId}</div>
              </div>
            </div>

            {/* Movie & Cinema Info */}
            <div className="row g-4 align-items-center mb-4">
              <div className="col-auto">
                <img
                  src={booking.movie?.posterUrl}
                  alt={booking.movie?.title}
                  className="rounded-3 border border-secondary shadow-sm"
                  style={{ width: '90px', height: '125px', objectFit: 'cover' }}
                />
              </div>
              <div className="col">
                <span className="badge bg-danger bg-opacity-25 text-danger mb-1">
                  {booking.format || '2D'} • {booking.screenName}
                </span>
                <h4 className="text-white fw-bold mb-1">{booking.movie?.title}</h4>
                <div className="text-secondary small mb-2">
                  <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                  {booking.theater?.name} ({booking.theater?.city})
                </div>
                <div className="d-flex flex-wrap gap-3 text-white small">
                  <div>
                    <span className="text-secondary d-block" style={{ fontSize: '0.72rem' }}>DATE</span>
                    <strong>{booking.showDate}</strong>
                  </div>
                  <div>
                    <span className="text-secondary d-block" style={{ fontSize: '0.72rem' }}>TIME</span>
                    <strong className="text-warning">{booking.showTime}</strong>
                  </div>
                  <div>
                    <span className="text-secondary d-block" style={{ fontSize: '0.72rem' }}>SEATS</span>
                    <strong className="text-danger">
                      {booking.seats?.map((s) => s.seatNumber).join(', ')}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Tear Section / Barcode & Verification */}
            <div className="pt-4 border-top border-dark border-dashed d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
              <div>
                <div className="text-secondary small mb-1">
                  <strong className="text-white">Ticket Code:</strong> {booking.ticketCode}
                </div>
                <div className="text-secondary small">
                  <strong className="text-white">Amount Paid:</strong> ₹{booking.totalAmount} ({booking.paymentDetails?.method || 'Card'})
                </div>
                <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                  Please show this QR/Barcode at the cinema turnstile for direct entry.
                </div>
              </div>

              {/* Simulated QR Code / Barcode graphic */}
              <div className="text-center p-2 rounded-3 bg-white text-dark shadow-sm">
                <i className="bi bi-qr-code fs-1 d-block"></i>
                <span className="d-block text-uppercase fw-bold text-dark" style={{ fontSize: '0.65rem', letterSpacing: '1px' }}>
                  SCAN ENTRY
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button className="btn btn-cinema-outline" onClick={handlePrint}>
              <i className="bi bi-printer me-2"></i> Print / Save Ticket
            </button>
            <Link to="/my-bookings" className="btn btn-cinema">
              <i className="bi bi-ticket-perforated me-2"></i> View My Bookings
            </Link>
            <Link to="/" className="btn btn-dark border-secondary">
              Back to Movies
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
