const pick = require('lodash.pick');

const UseCase = require('../use-case');
const schema = require('./schema');
const { ErrorGettingMovies } = require('../errors');

class GetMovies extends UseCase{
  constructor(data, database) {
    super(data, database, schema);
  }

  async execute() {
    await super.execute();

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
