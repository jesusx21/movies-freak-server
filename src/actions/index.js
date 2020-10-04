const addSaga = require('./add-saga');
const addMovie = require('./add-movie')
const getRandomMovies = require('./get-random-movies');
const markMovieAsWatched = require('./mark-movie-as-watched');

module.exports = {
  addSaga,
  addMovie,
  getRandomMovies,
  markMovieAsWatched
};