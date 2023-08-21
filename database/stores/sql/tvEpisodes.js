import { TVEpisodeNotFound } from '../errors';
import { SQLDatabaseException } from './errors';
import { TVEpisodeSerializer } from './serializers';

export default class SQLTVEpisodeStore {
  constructor(connection) {
    this._connection = connection;
  }

  async create(tvEpisode) {
    const dataToInsert = this._serialize(tvEpisode);

    let result;

    try {
      [result] = await this._connection('tv_episodes')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this._deserialize(result);
  }

  findById(tvEpisodeId) {
    return this._findOne('id', tvEpisodeId);
  }

  async findByTVSeasonId(tvSeasonId, options = {}) {
    let items;

    try {
      const query = this._connection('tv_episodes')
        .where('tv_season_id', tvSeasonId);

      if (options.skip) {
        query.offset(options.skip);
      }

      if (options.limit) {
        query.limit(options.limit);
      }

      items = await query.orderBy('episode_number');
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return {
      items: items.map(this._deserialize.bind(this)),
      totalItems: await this.countByTvSeasonId(tvSeasonId)
    };
  }

  async countByTvSeasonId(tvSeasonId) {
    try {
      const { count } = await this._connection('tv_episodes')
        .where('tv_season_id', tvSeasonId)
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
      result = await this._connection('tv_episodes')
        .where(...args)
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new TVEpisodeNotFound();
    }

    return this._deserialize(result);
  }

  _serialize(tvSerie) {
    return TVEpisodeSerializer.toJSON(tvSerie);
  }

  _deserialize(data) {
    return TVEpisodeSerializer.fromJSON(data);
  }
}
