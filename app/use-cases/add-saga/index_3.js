const schema = require('./schema');
const buildUseCase = require('../build-use-case');
const IMDBGateway = require('../../gateways/imdb');
const { MovieAlreadyAdded, SagaNotCreated } = require('../errors');

function addSaga(args) {
  const _data = args.data;
  const _database = args.database;
  const _entities = args.entities;
  const _imdbGateway = new IMDBGateway();

  const _useCase = buildUseCase({ schema, data: _data });

  const execute = async () => {
    await _useCase.execute();

    return _createSaga()
      .catch(_onUnexpectedError);
  };

  const _createSaga = async () => {
    const saga = await _addSaga();
    const movies = _addMovies(saga);

    return { ...saga, movies };
  };

  const _addSaga = async () => {
    const saga = await entities.buildSaga({
      name: _data.name,
      plot: _data.plot
    });

    return _database.sagas.create(saga);
  };

  const _addMovies = (saga) => {
    const promises = _data.movies.map(async (movieData) => {
      if (await _wasMovieAlreadyAdded(movieData)) {
        return Promise.reject(new MovieAlreadyAdded(imdbId));
      }

      const imdb = await _getIMDBInfo(movieData.imdbId);
      const movie = await entities.buildMovie({
        name: movieData.name || imdb.getTitle(),
        plot: movieData.plot || imdb.getPlot() || saga.getPlot(),
        numberOnSaga: movieData.numberOnSaga
      });

      movie.linkToIMDB(imdb);
      saga.addMovie(movie);

      return _database.movies.create(movie);
    });

    return Promise.all(promises);
  };

  const _wasMovieAlreadyAdded = async (movieData) => {
    const imdb = await _database.imdb.findByIMDBId(movieData.imdbId)
      .catch((error) => {
        if (error.name !== 'ENTITY_NOT_FOUND') Promise.reject(error)
      });

    return Boolean(imdb);
  }

  const _getIMDBInfo = async (imdbId) => {
    const [imdbData] = await _imdbGateway.fetchMovies({ imdbId });
    const imdb = await _entities.buildIMDB(imdbData);

    return _database.imdb.create(imdb);
  };

  const _onUnexpectedError = (error) => {
    return Promise.reject(new SagaNotCreated(error, _data))
  };
}

module.exports = addSaga;
