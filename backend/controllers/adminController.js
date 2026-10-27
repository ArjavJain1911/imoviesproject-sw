const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Theater = require('../models/Theater');
const Show = require('../models/Show');

// @desc    Get dashboard metrics & statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalMovies = await Movie.countDocuments();
    const totalTheaters = await Theater.countDocuments();
    const totalShows = await Show.countDocuments({ status: 'active' });
    const totalBookings = await Booking.countDocuments();

    // Calculate total revenue and total tickets sold from confirmed bookings
    const confirmedBookings = await Booking.find({ status: 'confirmed' });
    const totalRevenue = confirmedBookings.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
    const totalTicketsSold = confirmedBookings.reduce((acc, curr) => acc + (curr.seats?.length || 0), 0);

    // Recent 5 bookings
    const recentBookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('movie', 'title')
      .populate('theater', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalMovies,
        totalTheaters,
        totalShows,
        totalBookings,
        totalTicketsSold,
        totalRevenue,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminStats };
