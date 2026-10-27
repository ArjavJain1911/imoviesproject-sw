const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theater: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theater',
      required: true,
    },
    screenName: {
      type: String,
      required: true,
      default: 'Audi 1',
    },
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX 3D', '4DX', 'Dolby Atmos', 'Gold Class', 'Standard 2D', 'Laser 4K'],
      default: '2D',
    },
    language: {
      type: String,
      default: 'English',
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: true,
    },
    time: {
      type: String, // e.g. "10:30 AM", "01:45 PM", "05:15 PM", "08:30 PM", "11:00 PM"
      required: true,
    },
    pricing: {
      vip: { type: Number, default: 350 },
      premium: { type: Number, default: 250 },
      standard: { type: Number, default: 180 },
    },
    seatLayout: {
      rows: {
        type: [String],
        default: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      },
      cols: {
        type: Number,
        default: 10,
      },
      // Seat categories mapping:
      // Rows A, B -> VIP
      // Rows C, D, E -> Premium
      // Rows F, G, H -> Standard
      bookedSeats: {
        type: [String],
        default: [],
      },
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

showSchema.index({ movie: 1, date: 1 });
showSchema.index({ theater: 1, date: 1 });

const Show = mongoose.model('Show', showSchema);
module.exports = Show;
