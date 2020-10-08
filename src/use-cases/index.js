const addSaga = require('./add-saga');
const addMovie = require('./add-movie')
const getRandomMovies = require('./get-random-movies');
const markMovieAsWatched = require('./mark-movie-as-watched');
const findMovieById = require('./find-movie-by-id');
const findMovieByName = require('./find-movie-by-name');

module.exports = {
  addSaga,
  addMovie,
  getRandomMovies,
  findMovieById,
  findMovieByName,
  markMovieAsWatched
};