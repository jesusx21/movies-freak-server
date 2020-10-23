const isEmpty = require('lodash.isempty');

const UseCase = require('../use-case');
const schema = require('./schema');
const { ErrorGettingMovies, MoviesToWatchNotFound } = require('../errors');

class GetRandomMovies extends UseCase {
  constructor(data, database) {
    super(data, database, schema);
  }

  async execute() {
    await super.execute();

    const sagas = await this._getSagas();

    if (sagas.length === this._data.limit) {
      return this._getMoviesFromSagas(sagas)
        .catch(this._onUnexpectedError.bind(this));
    }

    return this._getRandomMovies(sagas)
      .catch(this._onUnexpectedError.bind(this));
  }

  async _getSagas() {
    const sagas = await this._database.sagas.findUnwatched();

    if (isEmpty(sagas)) return this._onEmptySagas();

    return sagas;
  }

  _getMoviesFromSagas(sagas) {
    const promises = sagas.map((saga) => {
      return this._database.movies.findNextBySagaId(saga.id);
    });

    return Promise.all(promises);
  }

  async _getRandomMovies(sagas) {
    const randomIndexes = this._getRandomIndexes(sagas);

    const movies = await randomIndexes.reduce(async (promise, index) => {
      if (index === -1) promise;

      const result = await promise;
      const saga = sagas[index];
      const movie = await this._database.movies.findNextBySagaId(saga.id);

      return [ ...result, movie];
    }, Promise.resolve([]));

    return movies;
  }

  _getRandomIndexes(sagas) {
    let numberOfIndexes = sagas.length < this._data.limit ? sagas.length : this._data.limit;
    const randomIndexes = [];

    const getIndexes = () => {
      if (numberOfIndexes === 0) return randomIndexes;

      const index = Math.round(Math.random() * (sagas.length - 1));

      randomIndexes.push(index);
      numberOfIndexes -= 1;

      return getIndexes();
    }

    return getIndexes();
  }

  _onEmptySagas() {
    return Promise.reject(new MoviesToWatchNotFound());
  }

  _onUnexpectedError(error) {
    return Promise.reject(new ErrorGettingMovies(error, this._data));
  }
}

module.exports = GetRandomMovies;
