const MoviesStore = require('./movies');

function buildStore(connection) {
  const movies = new MoviesStore(connection);

  return {
    movies
  };
}

module.exports = buildStore;
