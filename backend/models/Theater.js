const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true,
  },
  screenName: {
    type: String,
    required: true,
  },
  screenType: {
    type: String,
    enum: ['IMAX 3D', '4DX', 'Dolby Atmos', 'Standard 2D', 'Gold Class'],
    default: 'Dolby Atmos',
  },
  totalSeats: {
    type: Number,
    default: 80,
  },
});

const theaterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add theater name'],
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    facilities: {
      type: [String],
      default: ['Parking', 'Food Court', 'Wheelchair Accessible', 'M-Ticket'],
    },
    screens: [screenSchema],
  },
  {
    timestamps: true,
  }
);

const Theater = mongoose.model('Theater', theaterSchema);
module.exports = Theater;
