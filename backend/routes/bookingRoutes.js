const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

router.get('/my-bookings', protect, getMyBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
