const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: String,
  movieId: String,
});

const Favorite = mongoose.model("Favorite", favoriteSchema, "Favorite");

module.exports = Favorite; 