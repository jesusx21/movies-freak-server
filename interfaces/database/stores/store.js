const camelizeObject = require('camelcase-keys');
const snakeObject = require('snakecase-keys');
const omit = require('lodash.omit');
const isEmpty = require('lodash.isempty');
const snakeCase = require('lodash.snakecase');

const { DatabaseError, EntityNotFound, InvalidInputData, InvalidId } = require('../errors');

class Store {
  constructor(connection) {
    this._connection = connection;
    this._tableName = null;
    this._storeName = null;
  }

  async create(data) {
    const dataToSave = this._formatInputData(omit(data, 'id'));

    const [record] = await this._connection(this._tableName)
      .insert(dataToSave)
      .returning('*')
      .catch((error) => this._onUnexpectedError(error, data));

    return this._formatOutputData(record);
  }

  async findById(id) {
    const record = await this._connection(this._tableName)
      .where('id', id)
      .first()
      .catch((error) => this._onUnexpectedError(error, id));

    if (!record) return this._onNotFoundError(id)

    return this._formatOutputData(record);
  }

  async update(data) {
    const dataToSave = this._formatInputData(omit(data, ['id', 'createdAt']));

    await this._connection(this._tableName)
      .where('id', data.id)
      .update({ ...dataToSave, updated_at: new Date() })
      .catch((error) => this._onUnexpectedError(error, data));

    return this.findById(data.id);
  }

  async find(query) {
    const filter = this._formatInputData(query.filter);
    const orderBy = isEmpty(filter.sort) ? [{ field: 'created_at', order: 'desc'}] : filter.sort;
    const sort = this._parseSortObject(orderBy);

    const qb = this._connection(this._tableName)
      .where(filter)
      .orderBy(sort);

    if (query.limit) qb.limit(query.limit);
    if (query.skip) qb.offset(query.skip);

    const records = await qb
      .catch(this._onUnexpectedError)

    return records.map(this._formatOutputData);
  }

  async _findOne(query) {
    const filter = this._formatInputData(query.filter);
    const orderBy = isEmpty(query.sort) ? [{ field: 'created_at', order: 'desc'}] : query.sort;
    const sort = this._parseSortObject(orderBy);

    const qb = this._connection(this._tableName)
      .where(filter)
      .orderBy(sort)
      .first();

    console.log(qb.toString())
    const result = await qb.catch(this._onUnexpectedError)

    return this._formatOutputData(result)
  }

  _parseSortObject(sort = []) {
    return sort.map((item) => {
      return {
        column: snakeCase(item.field),
        order: item.order.toUpperCase()
      };
    });
  }

  _formatInputData(data) {
    return snakeObject(data, { deep: true });
  }

  _formatOutputData(data) {
    return camelizeObject(data, { deep: true });
  }

  _onUnexpectedError(error, data = {}) {
    if (error.code === '42703') return Promise.reject(new InvalidInputData(error, data));
    if (error.code === '22P02') {
      if (error.file === 'uuid.c') return Promise.reject(new InvalidId(data))
      return Promise.reject(new InvalidInputData(error, data));
    }

    return Promise.reject(new DatabaseError(error));
  }

  _onNotFoundError(id) {
    return Promise.reject(new EntityNotFound(id, this._storeName));
  }
}

module.exports = Store;
