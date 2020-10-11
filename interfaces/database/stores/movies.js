const Store = require('./store');

class MoviesStore extends Store {
  constructor(connection) {
    super(connection);

    this._tableName = 'movies';
    this._storeName = 'Movie'
  }
}

module.exports = MoviesStore;
