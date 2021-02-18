const schema = require('./schema');
const UseCase = require('../use-case');
const IMDBGateway = require('../../gateways/imdb');

class GetMoviesFromIMDB extends UseCase {
  constructor(data) {
    super(data, null, schema)

    this._imdbGateway = new IMDBGateway();
  }

  execute() {
    return this._imdbGateway.getMovies(this._data);
  }
}

module.exports = GetMoviesFromIMDB;
