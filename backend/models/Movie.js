const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a movie title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add movie description'],
    },
    posterUrl: {
      type: String,
      required: [true, 'Please add movie poster URL'],
    },
    backdropUrl: {
      type: String,
      default: '',
    },
    genre: {
      type: [String],
      required: true,
      validate: [v => Array.isArray(v) && v.length > 0, 'At least one genre is required'],
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Please specify duration in minutes'],
    },
    language: {
      type: String,
      required: true,
      default: 'English',
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0,
    },
    votesCount: {
      type: Number,
      default: 1250,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    director: {
      type: String,
      default: '',
    },
    producer: {
      type: String,
      default: '',
    },
    cast: {
      type: [String],
      default: [],
    },
    certificate: {
      type: String,
      enum: ['U', 'U/A', 'A', 'PG-13', 'R'],
      default: 'U/A',
    },
    status: {
      type: String,
      enum: ['now-showing', 'coming-soon'],
      default: 'now-showing',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

movieSchema.index({ title: 'text', description: 'text' });

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;
