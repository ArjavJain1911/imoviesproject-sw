const Movie = require('../models/Movie');

// @desc    Get all movies with filters & search
// @route   GET /api/movies
// @access  Public
const getMovies = async (req, res, next) => {
  try {
    const { search, genre, language, status, sort } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } },
        { cast: { $regex: search, $options: 'i' } },
      ];
    }

    if (genre && genre !== 'All') {
      query.genre = { $in: [genre] };
    }

    if (language && language !== 'All') {
      query.language = language;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    let sortOption = { rating: -1 };
    if (sort === 'releaseDate') {
      sortOption = { releaseDate: -1 };
    } else if (sort === 'title') {
      sortOption = { title: 1 };
    }

    const movies = await Movie.find(query).sort(sortOption);

    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured / top banner movies
// @route   GET /api/movies/featured
// @access  Public
const getFeaturedMovies = async (req, res, next) => {
  try {
    const featured = await Movie.find({ status: 'now-showing' })
      .sort({ rating: -1 })
      .limit(5);

    res.json({
      success: true,
      count: featured.length,
      data: featured,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct genres and languages
// @route   GET /api/movies/filters
// @access  Public
const getMovieFilters = async (req, res, next) => {
  try {
    const genres = await Movie.distinct('genre');
    const languages = await Movie.distinct('language');

    res.json({
      success: true,
      data: {
        genres: ['All', ...genres.sort()],
        languages: ['All', ...languages.sort()],
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single movie by ID
// @route   GET /api/movies/:id
// @access  Public
const getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new movie (Admin)
// @route   POST /api/movies
// @access  Private/Admin
const createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a movie (Admin)
// @route   PUT /api/movies/:id
// @access  Private/Admin
const updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({
      success: true,
      message: 'Movie updated successfully',
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a movie (Admin)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovies,
  getFeaturedMovies,
  getMovieFilters,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
};
