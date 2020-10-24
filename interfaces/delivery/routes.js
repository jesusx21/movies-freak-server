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

  'GET /halloween-movies/health': {
    controller: controllers.health
  }
}

module.exports = routes;
