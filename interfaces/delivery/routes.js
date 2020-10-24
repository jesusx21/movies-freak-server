const controllers = require('./controllers');
const schemas = require('./schemas');

const routes = {
  'POST /halloween-movies/add-saga': {
    controller: controllers.addSaga,
    payloadSchema: schemas.addSaga
  },

  'GET /halloween-movies/movies': {
    controller: controllers.getMovies
  },

  'GET /halloween-movies/movies/{movieId}': {
    controller: controllers.getMovieById
  },

  'GET /halloween-movies/movies/random': {
    controller: controllers.getRandomMovies
  },

  'GET /halloween-movies/movies/imdb': {
    controller: controllers.getMoviesFromIMDB
  },

  'GET /halloween-movies/health': {
    controller: controllers.health
  },

  'POST /halloween-movies/movies/{movieId}/mark-as-watched': {
    controller: controllers.markMovieAsWatched
  }
}

module.exports = routes;
