import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI } from '../services/api';

const AVAILABLE_SNACKS = [
  { id: 'snack-1', name: 'Caramel Popcorn (Jumbo)', price: 250, icon: 'bi-cup-straw', desc: 'Fresh crunchy buttery popcorn' },
  { id: 'snack-2', name: 'Crispy Nachos & Salsa', price: 220, icon: 'bi-triangle', desc: 'Warm tortilla chips with rich cheese dip' },
  { id: 'snack-3', name: 'Chilled Coke (Double Cup)', price: 180, icon: 'bi-cup-hot', desc: 'Ice cold carbonated refreshment' },
  { id: 'snack-4', name: 'VIP Cinema Feast Combo', price: 550, icon: 'bi-box2-heart', desc: '1 Jumbo Tub + 2 Drinks + 1 Nachos' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    selectedShow,
    selectedMovie,
    selectedSeats,
    selectedAddons,
    toggleAddon,
    seatsSubtotal,
    addonsSubtotal,
    convenienceFee,
    clearBooking,
  } = useBooking();

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fallback if accessed without selection
  if (!selectedShow || selectedSeats.length === 0) {
    return (
      <div className="container py-5 text-center my-5">
        <h4 className="text-white">No active booking session</h4>
        <p className="text-secondary">Please pick a movie and select seats first.</p>
        <button className="btn btn-cinema mt-2" onClick={() => navigate('/')}>
          Browse Movies
        </button>
      </div>
    );
  }

  const applyPromoCode = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'IMOVIE20') {
      const disc = Math.round(seatsSubtotal * 0.2);
      setDiscount(disc);
      setPromoApplied(true);
      setError('');
    } else if (promoCode.trim().toUpperCase() === 'WELCOME100') {
      setDiscount(100);
      setPromoApplied(true);
      setError('');
    } else {
      setError('Invalid coupon code. Try "IMOVIE20" or "WELCOME100"');
    }
  };

  const finalTotal = Math.max(0, seatsSubtotal + addonsSubtotal + convenienceFee - discount);

  const handleConfirmPayment = async () => {
    try {
      setIsSubmitting(true);
      setError('');

      const bookingPayload = {
        showId: selectedShow._id,
        seats: selectedSeats,
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit/Debit Card'
            : paymentMethod === 'upi'
            ? 'UPI FastPay'
            : 'Net Banking',
      };

      const res = await bookingsAPI.create(bookingPayload);

      if (res.data.success) {
        const booking = res.data.data;
        clearBooking();
        navigate(`/confirmation/${booking._id}`, { state: { booking } });
      }
    } catch (err) {
      setError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        {/* Left Column: Snacks & Payment Selection */}
        <div className="col-lg-8">
          {/* Cinema Snacks Add-ons */}
          <div className="im-card p-4 rounded-4 mb-4" style={{ background: '#12141e' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="text-white fw-bold mb-0">
                <i className="bi bi-cup-straw text-danger me-2"></i> Grab a Bite (Optional Add-ons)
              </h5>
              <span className="text-secondary small">Delivered directly to your seat</span>
            </div>

            <div className="row g-3">
              {AVAILABLE_SNACKS.map((snack) => {
                const isSelected = selectedAddons.some((a) => a.id === snack.id);
                return (
                  <div key={snack.id} className="col-md-6">
                    <div
                      className={`p-3 rounded-3 d-flex justify-content-between align-items-center transition cursor-pointer ${
                        isSelected
                          ? 'border border-danger bg-danger bg-opacity-10'
                          : 'border border-dark bg-dark'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleAddon(snack)}
                    >
                      <div className="d-flex align-items-center gap-3">
                        <i className={`bi ${snack.icon} fs-3 text-warning`}></i>
                        <div>
                          <div className="text-white fw-semibold small">{snack.name}</div>
                          <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{snack.desc}</div>
                          <div className="text-white fw-bold small mt-1">₹{snack.price}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 fw-semibold ${
                          isSelected ? 'btn-danger' : 'btn-outline-secondary'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAddon(snack);
                        }}
                      >
                        {isSelected ? 'Added ✓' : '+ Add'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="im-card p-4 rounded-4 mb-4" style={{ background: '#12141e' }}>
            <h5 className="text-white fw-bold mb-3">
              <i className="bi bi-credit-card-2-front text-danger me-2"></i> Select Payment Method
            </h5>

            <div className="d-flex flex-column gap-3 mb-4">
              {/* Credit/Debit Card Option */}
              <div
                className={`p-3 rounded-3 border transition ${
                  paymentMethod === 'card' ? 'border-danger bg-danger bg-opacity-10' : 'border-dark bg-dark'
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="form-check d-flex align-items-center gap-2 mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="payCard"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <label className="form-check-label text-white fw-semibold" htmlFor="payCard">
                    Credit / Debit Card (Visa, Mastercard, RuPay, Amex)
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="row g-2 mt-2 pt-2 border-top border-dark">
                    <div className="col-12">
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark text-white border-secondary"
                        placeholder="Card Number (4242 •••• •••• 4242)"
                        defaultValue="4242 8812 9012 3456"
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark text-white border-secondary"
                        placeholder="MM / YY"
                        defaultValue="12/28"
                      />
                    </div>
                    <div className="col-6">
                      <input
                        type="text"
                        className="form-control form-control-sm bg-dark text-white border-secondary"
                        placeholder="CVV"
                        defaultValue="892"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* UPI Option */}
              <div
                className={`p-3 rounded-3 border transition ${
                  paymentMethod === 'upi' ? 'border-danger bg-danger bg-opacity-10' : 'border-dark bg-dark'
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setPaymentMethod('upi')}
              >
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="payUpi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <label className="form-check-label text-white fw-semibold" htmlFor="payUpi">
                    UPI Instant Payment (Google Pay, PhonePe, Paytm QR)
                  </label>
                </div>
              </div>

              {/* Net Banking */}
              <div
                className={`p-3 rounded-3 border transition ${
                  paymentMethod === 'netbanking' ? 'border-danger bg-danger bg-opacity-10' : 'border-dark bg-dark'
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => setPaymentMethod('netbanking')}
              >
                <div className="form-check d-flex align-items-center gap-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    id="payNet"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                  />
                  <label className="form-check-label text-white fw-semibold" htmlFor="payNet">
                    Net Banking (All Major Banks)
                  </label>
                </div>
              </div>
            </div>

            {/* Error Feedback */}
            {error && (
              <div className="alert alert-danger py-2 small mb-0">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="col-lg-4">
          <div className="im-card p-4 rounded-4 sticky-top" style={{ top: '90px', background: '#12141e' }}>
            <h5 className="text-white fw-bold mb-3 border-bottom border-dark pb-2">
              Order Breakdown
            </h5>

            {/* Movie Info */}
            <div className="d-flex align-items-center gap-3 mb-3">
              <img
                src={selectedMovie?.posterUrl}
                alt={selectedMovie?.title}
                className="rounded-3 border border-secondary"
                style={{ width: '50px', height: '70px', objectFit: 'cover' }}
              />
              <div>
                <div className="text-white fw-bold small">{selectedMovie?.title}</div>
                <div className="text-secondary small">{selectedShow?.theater?.name}</div>
                <div className="text-danger small fw-semibold">
                  {selectedShow?.date} • {selectedShow?.time}
                </div>
              </div>
            </div>

            {/* Selected Seats Badges */}
            <div className="mb-3">
              <span className="text-secondary small d-block mb-1">Seats:</span>
              <div className="d-flex flex-wrap gap-1">
                {selectedSeats.map((s) => (
                  <span key={s.seatNumber} className="badge bg-danger">
                    {s.seatNumber} ({s.tier})
                  </span>
                ))}
              </div>
            </div>

            {/* Coupon Code Section */}
            <form onSubmit={applyPromoCode} className="mb-3">
              <label className="text-secondary small mb-1">Have a Promo Code?</label>
              <div className="input-group input-group-sm">
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary text-uppercase"
                  placeholder="e.g. IMOVIE20"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                <button
                  type="submit"
                  className="btn btn-danger"
                  disabled={promoApplied || !promoCode}
                >
                  {promoApplied ? 'Applied' : 'Apply'}
                </button>
              </div>
              {promoApplied && (
                <div className="text-success small mt-1">
                  <i className="bi bi-check-circle me-1"></i> Coupon applied: -₹{discount}
                </div>
              )}
            </form>

            {/* Bill Details */}
            <div className="d-flex flex-column gap-2 small border-top border-dark pt-3 mb-4">
              <div className="d-flex justify-content-between text-secondary">
                <span>Tickets ({selectedSeats.length})</span>
                <span className="text-white">₹{seatsSubtotal}</span>
              </div>
              {addonsSubtotal > 0 && (
                <div className="d-flex justify-content-between text-secondary">
                  <span>Food & Beverages ({selectedAddons.length})</span>
                  <span className="text-white">₹{addonsSubtotal}</span>
                </div>
              )}
              <div className="d-flex justify-content-between text-secondary">
                <span>Convenience Fee</span>
                <span className="text-white">₹{convenienceFee}</span>
              </div>
              {discount > 0 && (
                <div className="d-flex justify-content-between text-success fw-semibold">
                  <span>Promo Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="d-flex justify-content-between text-white fw-bold fs-5 border-top border-dark pt-2 mt-1">
                <span>Total Payable</span>
                <span className="text-danger">₹{finalTotal}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              className="btn btn-cinema w-100 py-3 fw-bold d-flex justify-content-center align-items-center gap-2 shadow"
              disabled={isSubmitting}
              onClick={handleConfirmPayment}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-shield-lock-fill"></i>
                  <span>Pay ₹{finalTotal} & Confirm</span>
                </>
              )}
            </button>

            <div className="text-center text-secondary small mt-3" style={{ fontSize: '0.75rem' }}>
              <i className="bi bi-lock-fill text-success me-1"></i>
              256-Bit Encrypted Simulated Payment Gateway
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
