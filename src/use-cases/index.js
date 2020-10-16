const addSaga = require('./add-saga');
const addMovie = require('./add-movie');
const findMovieById = require('./find-movie-by-id');
const findMovieByName = require('./find-movie-by-name');
const getMoviesWatched = require('./get-movies-watched');
const getRandomMovies = require('./get-random-movies');
const markMovieAsWatched = require('./mark-movie-as-watched');

module.exports = {
  addSaga,
  addMovie,
  findMovieById,
  findMovieByName,
  getMoviesWatched,
  getRandomMovies,
  markMovieAsWatched
};