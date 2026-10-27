const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
    },
    seats: [
      {
        seatNumber: { type: String, required: true },
        tier: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      default: 30,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    showDate: {
      type: String,
      required: true,
    },
    showTime: {
      type: String,
      required: true,
    },
    screenName: {
      type: String,
      default: 'Audi 1',
    },
    format: {
      type: String,
      default: '2D',
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    paymentDetails: {
      method: { type: String, default: 'Online' },
      transactionId: { type: String },
      paidAt: { type: Date, default: Date.now },
    },
    ticketCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ user: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
