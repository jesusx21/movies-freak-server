const schema = require('./schema');
const IMDBGateway = require('../../gateways/imdb');
const buildUseCase = require('../build-use-case');

function addSaga(args) {
  const self = {
    _data: args.data,
    _database: args.database,
    _entities: args.entities
  };

  self._imdbGateway = new IMDBGateway();
  self._useCase = buildUseCase({ schema, data: self._data });

  const execute = async () => {
    await self._useCase.execute();

  }

  const _createSaga = async () => {
    const saga = await self._entities.buildSaga({
      name: self._data.name,
      plot: self._data.plot
    });

    return self._database.sagas.create(saga);
  }

  const _addMovies = () => {

  }

  const _createMovie = async (movieData) => {
    if (await _wasMovieAlreadyAdded(movieData)) {

    }
  }

  const _wasMovieAlreadyAdded = async (movieData) => {
    const imdb = await _database.imdb.findByIMDBId(movieData.imdbId)
      .catch((error) => {
        if (error.name !== 'ENTITY_NOT_FOUND') return Promise.reject(error);
      });

    return Boolean(imdb);
  }

  return execute();
}

module.exports = addSaga;
