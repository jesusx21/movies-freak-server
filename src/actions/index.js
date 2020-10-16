const addMovies = require('./add-movies');
const findMovieById = require('./find-movie-by-id');
const findMovieByName = require('./find-movie-by-name');
const getMovie = require('./get-movie');
const getMovies = require('./get-movies');
const getMoviesWatched = require('./get-movies-watched');

module.exports = {
  addMovies,
  findMovieById,
  findMovieByName,
  getMovie,
  getMovies,
  getMoviesWatched
};
