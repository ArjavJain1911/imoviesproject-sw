const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Show = require('../models/Show');
const Booking = require('../models/Booking');
const seedData = require('./seedData');

dotenv.config();

// Helper to format dates as YYYY-MM-DD
const getDateStr = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const seedDatabase = async () => {
  try {
    console.log('[Seeder] Clearing existing database collections...');
    await Booking.deleteMany({});
    await Show.deleteMany({});
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await User.deleteMany({});

    console.log('[Seeder] Seeding Users...');
    const createdUsers = [];
    for (const u of seedData.users) {
      const user = await User.create(u);
      createdUsers.push(user);
    }
    console.log(`[Seeder] Seeded ${createdUsers.length} users (Admin: admin@imovies.com / admin123)`);

    console.log('[Seeder] Seeding Theaters...');
    const createdTheaters = await Theater.insertMany(seedData.theaters);
    console.log(`[Seeder] Seeded ${createdTheaters.length} theaters`);

    console.log('[Seeder] Seeding Movies...');
    const createdMovies = await Movie.insertMany(seedData.movies);
    console.log(`[Seeder] Seeded ${createdMovies.length} movies`);

    console.log('[Seeder] Generating Shows & Showtime Schedules...');
    const nowShowingMovies = createdMovies.filter(m => m.status === 'now-showing');

    const showtimes = [
      { time: '10:30 AM', format: 'Dolby Atmos', screen: 'Audi 1 - IMAX 3D Laser', pricing: { vip: 350, premium: 250, standard: 180 } },
      { time: '01:45 PM', format: 'IMAX 3D', screen: 'Audi 1 - IMAX 3D Laser', pricing: { vip: 400, premium: 300, standard: 220 } },
      { time: '05:15 PM', format: 'Dolby Atmos', screen: 'Audi 2 - Dolby Atmos Prime', pricing: { vip: 350, premium: 250, standard: 180 } },
      { time: '08:30 PM', format: '4DX', screen: 'Audi 3 - 4DX Dynamic', pricing: { vip: 450, premium: 350, standard: 250 } },
      { time: '11:00 PM', format: '2D', screen: 'Audi 2 - Dolby Atmos Prime', pricing: { vip: 300, premium: 220, standard: 150 } },
    ];

    const showsToInsert = [];
    // Generate shows for next 5 days
    for (let dayOffset = 0; dayOffset <= 4; dayOffset++) {
      const dateStr = getDateStr(dayOffset);

      for (const movie of nowShowingMovies) {
        for (const theater of createdTheaters) {
          // Add 2-3 showtimes per theater per movie
          const selectedTimes = showtimes.slice(0, 3 + (movie.title.length % 2));

          for (let i = 0; i < selectedTimes.length; i++) {
            const st = selectedTimes[i];
            // Simulate realistic pre-booked seats
            const preBooked = [
              'A3', 'A4', 'B5', 'B6', 'D4', 'D5', 'D6', 'E8', 'F2', 'F3'
            ].slice(0, (dayOffset === 0 ? 8 : 4) + (i % 3));

            showsToInsert.push({
              movie: movie._id,
              theater: theater._id,
              screenName: theater.screens[i % theater.screens.length]?.screenName || st.screen,
              format: theater.screens[i % theater.screens.length]?.screenType || st.format,
              language: movie.language,
              date: dateStr,
              time: st.time,
              pricing: st.pricing,
              seatLayout: {
                rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
                cols: 10,
                bookedSeats: preBooked,
              },
              status: 'active',
            });
          }
        }
      }
    }

    const createdShows = await Show.insertMany(showsToInsert);
    console.log(`[Seeder] Seeded ${createdShows.length} active shows with seat availability`);

    // Seed a sample confirmed booking for the regular user
    const sampleShow = createdShows[0];
    const sampleMovie = nowShowingMovies[0];
    const sampleTheater = createdTheaters[0];
    const regularUser = createdUsers.find(u => u.role === 'user');

    if (sampleShow && regularUser) {
      await Booking.create({
        bookingId: 'IMV-834921',
        user: regularUser._id,
        movie: sampleMovie._id,
        theater: sampleTheater._id,
        show: sampleShow._id,
        seats: [
          { seatNumber: 'B5', tier: 'VIP', price: 400 },
          { seatNumber: 'B6', tier: 'VIP', price: 400 },
        ],
        subtotal: 800,
        convenienceFee: 60,
        totalAmount: 860,
        showDate: sampleShow.date,
        showTime: sampleShow.time,
        screenName: sampleShow.screenName,
        format: sampleShow.format,
        status: 'confirmed',
        paymentDetails: {
          method: 'Credit Card (**** 4242)',
          transactionId: 'TXN-A98B-7711',
          paidAt: new Date(),
        },
        ticketCode: 'TKT-991A-8842',
      });
      console.log('[Seeder] Seeded sample confirmed booking for user@imovies.com');
    }

    console.log('[Seeder] Database seeding successfully finished!');
  } catch (error) {
    console.error(`[Seeder] Error seeding database: ${error.message}`);
    throw error;
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('[Seeder] Database is empty. Running auto-seeding...');
      await seedDatabase();
    } else {
      console.log(`[Seeder] Database already populated with ${movieCount} movies.`);
    }
  } catch (err) {
    console.warn(`[Seeder] Auto-seed check notice: ${err.message}`);
  }
};

// If run directly from terminal: `node seed/seeder.js`
if (require.main === module) {
  const { connectDB, closeDB } = require('../config/db');
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      console.log('[Seeder] Completed. Closing connection.');
      await closeDB();
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}

module.exports = { seedDatabase, autoSeedIfEmpty };
