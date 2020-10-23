const omit = require('lodash.omit');
const isEmpty = require('lodash.isempty');

const Store = require('./store');

class MoviesStore extends Store {
  constructor(connection) {
    super(connection);

    this._tableName = 'movies';
    this._storeName = 'Movie'
  }

  async find(query) {
    const filter = this._formatInputData(omit(query.filter, ['name']));
    const orderBy = isEmpty(filter.sort) ? [{ field: 'created_at', order: 'desc'}] : filter.sort;
    const sort = this._parseSortObject(orderBy);

    const qb = this._connection(this._tableName)
      .where(filter);

    if (query.filter.name) qb.whereRaw(`name ILIKE '%${query.filter.name}%'`)

    qb.orderBy(sort);

    if (query.limit) qb.limit(query.limit);
    if (query.skip) qb.offset(query.skip);

    const records = await qb
      .catch(this._onUnexpectedError)

    return records.map(this._formatOutputData);
  }

  async findNextBySagaId(sagaId) {
    const filter = { sagaId, watched: false };
    const sort = [{ field: 'numberOnSaga', order: 'ASC' }]

    return this._findOne({ filter, sort })
  }
}

module.exports = MoviesStore;
