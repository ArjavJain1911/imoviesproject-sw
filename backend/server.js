const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const { autoSeedIfEmpty, seedDatabase } = require('./seed/seeder');

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'IMovies - Movie Ticket Booking API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Quick seed trigger for developer testing
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedDatabase();
    res.json({ success: true, message: 'Database seeded successfully with demo movies, theaters, shows and users!' });
  } catch (err) {
    next(err);
  }
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root endpoint welcome
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to IMovies API - Movie ticket booking made simple.',
    docs: '/api/health',
    endpoints: {
      auth: '/api/auth',
      movies: '/api/movies',
      shows: '/api/shows',
      bookings: '/api/bookings',
      admin: '/api/admin',
    },
  });
});

// Error handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await autoSeedIfEmpty();

    const server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🎬 IMovies Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
      console.log(`⭐ Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n[IMovies Server] Gracefully shutting down...');
      server.close(() => {
        console.log('[IMovies Server] HTTP server closed.');
        process.exit(0);
      });
    });

  } catch (err) {
    console.error(`[IMovies Server] Startup error: ${err.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
