import { TVSerieNotFound } from '../errors';
import { SQLDatabaseException } from './errors';
import { TVSerieSerializer } from './serializers';

export default class SQLTVSeriesStore {
  constructor(connection) {
    this._connection = connection;
  }

  async create(tvSerie) {
    const dataToInsert = this._serialize(tvSerie);

    let result;

    try {
      [result] = await this._connection('tv_series')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this._deserialize(result);
  }

  async find() {
    let result;

    try {
      result = await this._connection('tv_series');
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return result.map(this._deserialize.bind(this));
  }

  findById(tvSerieId) {
    return this._findOne('id', tvSerieId);
  }

  async find(options = {}) {
    let items;

    try {
      const query = this._connection('tv_series');

      if (options.skip) {
        query.offset(options.skip);
      }

      if (options.limit) {
        query.limit(options.limit);
      }

      items = await query.orderBy('created_at');
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return {
      items: items.map(this._deserialize.bind(this)),
      totalItems: await this.count()
    };
  }

  async count() {
    try {
      const { count } = await this._connection('tv_series')
        .count()
        .first();

      return Number(count);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }
  }

  async _findOne(...args) {
    let result;

    try {
      result = await this._connection('tv_series')
        .where(...args)
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new TVSerieNotFound();
    }

    return this._deserialize(result);
  }

  _serialize(tvSerie) {
    return TVSerieSerializer.toJSON(tvSerie);
  }

  _deserialize(data) {
    return TVSerieSerializer.fromJSON(data);
  }
}
