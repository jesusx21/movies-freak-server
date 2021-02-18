const IMDBStore = require('./imdb');
const MoviesStore = require('./movies');
const SagasStore = require('./sagas');

function buildStore(connection, entities) {
  const imdb = new IMDBStore(connection, entities.buildIMDB)
  const movies = new MoviesStore(connection, entities.buildMovie);
  const sagas = new SagasStore(connection, entities.buildSaga);

  return {
    imdb,
    movies,
    sagas
  };
}

module.exports = buildStore;
