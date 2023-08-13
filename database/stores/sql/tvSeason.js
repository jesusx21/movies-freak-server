import { TVSeasonNotFound } from '../errors';
import { SQLDatabaseException } from './errors';
import { TVSeasonSerializer } from './serializers';

export default class SQLTVSeason {
  constructor(connection) {
    this._connection = connection;
  }

  async create(tvSeason) {
    const dataToInsert = this._serialize(tvSeason);

    let result;

    try {
      [result] = await this._connection('tv_seasons')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this._deserialize(result);
  }

  findById(tvSeasonId) {
    return this._findOne('id', tvSeasonId);
  }

  async findByTVSerieId(tvSerieId, options = {}) {
    let items;

    try {
      const query = this._connection('tv_seasons')
        .where('tv_serie_id', tvSerieId);

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
      totalItems: await this.countByTvSerieId(tvSerieId)
    };
  }

  async countByTvSerieId(tvSerieId) {
    try {
      const { count } = await this._connection('tv_seasons')
        .where('tv_serie_id', tvSerieId)
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
      result = await this._connection('tv_seasons')
        .where(...args)
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new TVSeasonNotFound();
    }

    return this._deserialize(result);
  }

  _serialize(tvSerie) {
    return TVSeasonSerializer.toJSON(tvSerie);
  }

  _deserialize(data) {
    return TVSeasonSerializer.fromJSON(data);
  }
}
