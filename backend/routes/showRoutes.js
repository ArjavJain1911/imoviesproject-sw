const express = require('express');
const router = express.Router();
const {
  getShows,
  getShowsByMovie,
  getShowById,
  createShow,
  updateShow,
} = require('../controllers/showController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getShows)
  .post(protect, admin, createShow);

router.get('/movie/:movieId', getShowsByMovie);

router.route('/:id')
  .get(getShowById)
  .put(protect, admin, updateShow);

module.exports = router;
