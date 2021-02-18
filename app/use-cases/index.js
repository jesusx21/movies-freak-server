const AddSaga = require('./add-saga');
const GetMovieById = require('./get-movie-by-id');
const GetMovies = require('./get-movies');
const GetRandomMovies = require('./get-random-movies');
const GetMoviesFromIMDB = require('./get-movies-from-imdb');
const MarkMovieAsWatched = require('./mark-movie-as-watched');

module.exports = {
  AddSaga,
  GetMovieById,
  GetMovies,
  GetRandomMovies,
  GetMoviesFromIMDB,
  MarkMovieAsWatched
};
