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

  findById(tvSerieId) {
    return this._findOne('id', tvSerieId);
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
