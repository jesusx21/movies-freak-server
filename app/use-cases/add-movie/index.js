const ROOT_PATH = require('app-root-path');

const schema = require('./schema');
const validateSchema = require(`${ROOT_PATH}/utils`);

class AddSaga {
  constructor(data, database) {
    this._data = data;
    this._database = database;
  }

  execute() {
    await validateSchema(schema, data)

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
        genre: this._data.genre,
        numberOnSaga: movie.numberOnSaga,
        sagaId: saga.id
      };

      return this._database.movies.create(movieData);
    });

    return Promise.all(promises);
  }
}

module.exports = AddSaga;
