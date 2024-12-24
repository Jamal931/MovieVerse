const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    _id: String, // OMDB ID
    title: String,
    year: String,
    rated: String,
    released: String,
    runtime: String,
    genre: String,
    director: String,
    actors: String,
    plot: String,
    trailer: String,
});

module.exports = mongoose.model('Movie', movieSchema);
