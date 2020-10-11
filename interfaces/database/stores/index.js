const MoviesStore = require('./movies');
const SagasStore = require('./sagas');

function buildStore(connection) {
  const movies = new MoviesStore(connection);
  const sagas = new SagasStore(connection);

  return {
    movies,
    sagas
  };
}

module.exports = buildStore;
