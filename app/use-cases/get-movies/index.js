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
    const sort = [];

    if (filter.hasOwnProperty('watched')) sort.push({ field: 'watchedAt', order: 'ASC' });
    const movies = await this._database.movies.find({
      filter,
      sort,
      limit: this._data.limit,
      skip: this._data.skip
    })
      .catch(this._onUnexpectedError.bind(this));

    return movies
  }

  _onUnexpectedError(error) {
    return Promise.reject(new ErrorGettingMovies(error, this._data))
  }
}

module.exports = GetMovies;
