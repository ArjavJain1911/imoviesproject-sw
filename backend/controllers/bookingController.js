const crypto = require('crypto');
const Booking = require('../models/Booking');
const Show = require('../models/Show');

// Generate unique booking reference
const generateBookingId = () => {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `IMV-${randomNum}`;
};

const generateTicketCode = () => {
  return `TKT-${crypto.randomBytes(3).toString('hex').toUpperCase()}-${Date.now().toString().slice(-4)}`;
};

// @desc    Create a new booking (Reserve seats)
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { showId, seats, paymentMethod } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid showId and select at least one seat',
      });
    }

    const show = await Show.findById(showId)
      .populate('movie')
      .populate('theater');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    // Extract seat identifiers
    const requestedSeatNumbers = seats.map(s => s.seatNumber);

    // Verify none of the requested seats are already booked
    const alreadyBooked = requestedSeatNumbers.some(seatNum =>
      show.seatLayout.bookedSeats.includes(seatNum)
    );

    if (alreadyBooked) {
      return res.status(400).json({
        success: false,
        message: 'One or more of the selected seats have already been reserved. Please pick different seats.',
      });
    }

    // Calculate subtotal
    const subtotal = seats.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
    const convenienceFee = 30 * seats.length; // ₹30 / $30 base per ticket
    const totalAmount = subtotal + convenienceFee;

    // Atomically book the seats in the show
    show.seatLayout.bookedSeats.push(...requestedSeatNumbers);
    await show.save();

    // Create the booking document
    const booking = await Booking.create({
      bookingId: generateBookingId(),
      user: req.user._id,
      movie: show.movie._id,
      theater: show.theater._id,
      show: show._id,
      seats,
      subtotal,
      convenienceFee,
      totalAmount,
      showDate: show.date,
      showTime: show.time,
      screenName: show.screenName,
      format: show.format,
      status: 'confirmed',
      paymentDetails: {
        method: paymentMethod || 'Online / Card',
        transactionId: `TXN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
        paidAt: new Date(),
      },
      ticketCode: generateTicketCode(),
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie', 'title posterUrl duration language certificate')
      .populate('theater', 'name city address')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully! Confirmation details generated.',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie', 'title posterUrl duration language certificate')
      .populate('theater', 'name city address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID or ticket code
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie', 'title posterUrl backdropUrl duration language certificate director cast')
      .populate('theater', 'name city address facilities')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Allow only owner or admin to view
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking ticket',
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Allow only owner or admin
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled',
      });
    }

    // Release seats in the show
    const show = await Show.findById(booking.show);
    if (show) {
      const seatsToFree = booking.seats.map(s => s.seatNumber);
      show.seatLayout.bookedSeats = show.seatLayout.bookedSeats.filter(
        s => !seatsToFree.includes(s)
      );
      await show.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking has been successfully cancelled and seats have been released.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('movie', 'title posterUrl')
      .populate('theater', 'name city')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
};
