const UseCase = require('../use-case');
const schema = require('./schema');
const { SagaNotCreated } = require('../errors');

class AddSaga extends UseCase {
  constructor(data, database) {
    super(data, database, schema);
  }

  async execute() {
    await super.execute();

    return this._createSaga()
      .catch(this._onUnexpectedError.bind(this));
  }

  async _createSaga() {
    const saga = await this._addSaga();
    const movies = await this._addMovies(saga);

    return { ...saga, movies };
  }

  _addSaga() {
    const sagaData = {
      name: this._data.name,
      plot: this._data.plot,
      genre: this._data.genre,
      numberOfMovies: this._data.movies.length
    };

    return this._database.sagas.create(sagaData);
  }

  _addMovies(saga) {
    const promises = this._data.movies.map((movie) => {
      const movieData = {
        name: movie.name,
        plot: movie.plot || this._data.plot,
        numberOnSaga: movie.numberOnSaga,
        sagaId: saga.id
      };

      return this._database.movies.create(movieData);
    });

    return Promise.all(promises);
  }

  _onUnexpectedError(error) {
    return Promise.reject(new SagaNotCreated(error, this._data))
  }
}

module.exports = AddSaga;
