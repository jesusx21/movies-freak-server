const controllers = require('./controllers');

const routes = {
  'GET /halloween-movies/movies': {
    controller: controllers.getMovies
  },

  'GET /halloween-movies/health': {
    controller: controllers.health
  }
}

module.exports = routes;
