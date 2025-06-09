const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
mal_id: Number,
url : String,
image_url : String,  
rating : String,
title : String
});

const Movie = mongoose.model("movie", MovieSchema, "movie"); // Explicitly set the collection name

module.exports = Movie; 
