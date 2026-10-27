const Show = require('../models/Show');
const Theater = require('../models/Theater');

// @desc    Get all shows with optional filters
// @route   GET /api/shows
// @access  Public
const getShows = async (req, res, next) => {
  try {
    const { movieId, theaterId, date } = req.query;
    const query = { status: 'active' };

    if (movieId) query.movie = movieId;
    if (theaterId) query.theater = theaterId;
    if (date) query.date = date;

    const shows = await Show.find(query)
      .populate('movie', 'title posterUrl duration certificate language')
      .populate('theater', 'name city address facilities')
      .sort({ date: 1, time: 1 });

    res.json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shows grouped by theater for a specific movie & date
// @route   GET /api/shows/movie/:movieId
// @access  Public
const getShowsByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    const query = { movie: movieId, status: 'active' };
    if (date) {
      query.date = date;
    }

    const shows = await Show.find(query)
      .populate('theater', 'name city address facilities screens')
      .populate('movie', 'title posterUrl duration certificate language genre')
      .sort({ time: 1 });

    // Group shows by theater
    const theaterMap = {};

    shows.forEach((show) => {
      if (!show.theater) return;
      const theaterId = show.theater._id.toString();

      if (!theaterMap[theaterId]) {
        theaterMap[theaterId] = {
          theater: show.theater,
          shows: [],
        };
      }

      // Calculate total seats & booked seats count
      const totalSeats = (show.seatLayout.rows.length || 8) * (show.seatLayout.cols || 10);
      const bookedCount = show.seatLayout.bookedSeats.length;
      const availableSeats = totalSeats - bookedCount;

      theaterMap[theaterId].shows.push({
        _id: show._id,
        screenName: show.screenName,
        format: show.format,
        language: show.language,
        time: show.time,
        date: show.date,
        pricing: show.pricing,
        totalSeats,
        availableSeats,
        isAlmostFull: availableSeats <= 10 && availableSeats > 0,
        isSoldOut: availableSeats === 0,
      });
    });

    res.json({
      success: true,
      data: Object.values(theaterMap),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show by ID (with seat matrix)
// @route   GET /api/shows/:id
// @access  Public
const getShowById = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie', 'title posterUrl backdropUrl duration certificate language genre rating')
      .populate('theater', 'name city address facilities');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.json({
      success: true,
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new show (Admin)
// @route   POST /api/shows
// @access  Private/Admin
const createShow = async (req, res, next) => {
  try {
    const show = await Show.create(req.body);
    const populated = await Show.findById(show._id)
      .populate('movie', 'title')
      .populate('theater', 'name');

    res.status(201).json({
      success: true,
      message: 'Show created successfully',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a show (Admin)
// @route   PUT /api/shows/:id
// @access  Private/Admin
const updateShow = async (req, res, next) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    res.json({
      success: true,
      message: 'Show updated successfully',
      data: show,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getShows,
  getShowsByMovie,
  getShowById,
  createShow,
  updateShow,
};
