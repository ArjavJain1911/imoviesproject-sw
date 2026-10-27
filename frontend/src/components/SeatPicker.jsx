import React from 'react';

const SeatPicker = ({ show, selectedSeats, onToggleSeat }) => {
  if (!show || !show.seatLayout) {
    return <div className="text-secondary text-center p-4">Loading seat layout...</div>;
  }

  const { rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], cols = 10, bookedSeats = [] } = show.seatLayout;
  const pricing = show.pricing || { vip: 350, premium: 250, standard: 180 };

  const getSeatTier = (row) => {
    if (['A', 'B'].includes(row)) return 'VIP';
    if (['C', 'D', 'E'].includes(row)) return 'Premium';
    return 'Standard';
  };

  const getSeatPrice = (tier) => {
    if (tier === 'VIP') return pricing.vip;
    if (tier === 'Premium') return pricing.premium;
    return pricing.standard;
  };

  const isBooked = (seatNumber) => bookedSeats.includes(seatNumber);
  const isSelected = (seatNumber) => selectedSeats.some((s) => s.seatNumber === seatNumber);

  return (
    <div className="seat-picker-container p-3 p-md-4 rounded-4" style={{ background: '#12141e', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      {/* Curved Screen Indicator */}
      <div className="text-center screen-curve-wrap mb-4">
        <div className="cinema-screen mx-auto" style={{ maxWidth: '600px' }}></div>
        <div className="small text-secondary fw-semibold mt-2 text-uppercase" style={{ letterSpacing: '3px', fontSize: '0.75rem' }}>
          <i className="bi bi-display me-1"></i> Screen Direction
        </div>
      </div>

      {/* Seat Matrix Grid */}
      <div className="d-flex flex-column align-items-center overflow-auto py-2">
        {rows.map((row) => {
          const tier = getSeatTier(row);
          const price = getSeatPrice(tier);

          return (
            <div key={row} className="d-flex align-items-center mb-2">
              {/* Row Label Left */}
              <span className="text-secondary fw-bold me-2 me-md-3 text-center" style={{ width: '22px', fontSize: '0.85rem' }}>
                {row}
              </span>

              {/* Seats in Row */}
              <div className="d-flex align-items-center">
                {Array.from({ length: cols }, (_, i) => i + 1).map((colNum) => {
                  const seatNumber = `${row}${colNum}`;
                  const booked = isBooked(seatNumber);
                  const selected = isSelected(seatNumber);

                  let seatClass = 'available';
                  if (booked) seatClass = 'booked';
                  else if (selected) seatClass = 'selected';

                  return (
                    <React.Fragment key={seatNumber}>
                      {/* Walkway Aisle Gap in the Middle */}
                      {colNum === Math.ceil(cols / 2) + 1 && (
                        <div className="mx-2 mx-md-3"></div>
                      )}

                      <button
                        type="button"
                        className={`seat ${seatClass}`}
                        disabled={booked}
                        onClick={() => !booked && onToggleSeat(seatNumber, tier, price)}
                        title={`${seatNumber} - ${tier} (₹${price}) ${booked ? '[Booked]' : ''}`}
                      >
                        {colNum}
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Row Label Right */}
              <span className="text-secondary fw-bold ms-2 ms-md-3 text-center" style={{ width: '22px', fontSize: '0.85rem' }}>
                {row}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend & Seat Tiers */}
      <div className="mt-4 pt-3 border-top border-dark d-flex flex-wrap justify-content-center gap-4 text-secondary small">
        <div className="d-flex align-items-center gap-2">
          <div className="seat available m-0" style={{ width: '20px', height: '20px', fontSize: '0.6rem' }}></div>
          <span>Available</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat selected m-0" style={{ width: '20px', height: '20px', fontSize: '0.6rem' }}></div>
          <span className="text-white">Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="seat booked m-0" style={{ width: '20px', height: '20px', fontSize: '0.6rem' }}></div>
          <span>Sold Out</span>
        </div>
        <div className="d-flex align-items-center gap-2 border-start border-secondary ps-3">
          <span className="badge bg-warning bg-opacity-25 text-warning">VIP: ₹{pricing.vip}</span>
          <span className="badge bg-primary bg-opacity-25 text-info">Premium: ₹{pricing.premium}</span>
          <span className="badge bg-secondary bg-opacity-25 text-light">Standard: ₹{pricing.standard}</span>
        </div>
      </div>
    </div>
  );
};

export default SeatPicker;
