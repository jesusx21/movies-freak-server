const ROOT_PATH = require('app-root-path');
const pick = require('lodash.pick');

const schema = require('./schema');
const { validateSchema } = require(`${ROOT_PATH}/utils`);
const { ErrorGettingMovies } = require('../errors');

class GetMovies {
  constructor(data, database) {
    this._data = data;
    this._database = database;
  }

  async execute() {
    await validateSchema(schema, this._data);

    const filter = pick(this._data, ['sagaId', 'name', 'watched']);
    const movies = await this._database.movies.find({ filter, limit: this._data.limit })
      .catch(this._onUnexpectedError.bind(this));

    return movies
  }

  _onUnexpectedError(error) {
    return Promise.reject(new ErrorGettingMovies(error, this._data))
  }
}

module.exports = GetMovies;
