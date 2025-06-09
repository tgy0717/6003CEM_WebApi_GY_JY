const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  movieId: String,
  userId: String,
  cinema: String,
  bookingDate: String,
  quantity: Number,
  total: Number,
  paymentStatus: String,
  sessionId: String,
}, { timestamps: true });

module.exports = mongoose.model('booking', bookingSchema);
