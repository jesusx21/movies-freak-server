import { Knex } from 'knex';

import { QueryOptions, QueryResponse } from '../interfaces';
import { SQLDatabaseException } from './errors';
import { TVEpisode } from '../../../app/moviesFreak/entities';
import { TVEpisodeNotFound } from '../errors';
import { TVEpisodeSerializer } from './serializers';
import { UUID } from '../../../typescript/customTypes';

class SQLTVEpisodeStore {
  private connection: Knex;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  async create(tvEpisode: TVEpisode) {
    const dataToInsert = this.serialize(tvEpisode);

    let result: {};

    try {
      [result] = await this.connection('tv_episodes')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  findById(tvEpisodeId: UUID) {
    return this.findOne({ id: tvEpisodeId });
  }

  async findByTVSeasonId(tvSeasonId: UUID, options: QueryOptions = {}): Promise<QueryResponse<TVEpisode>> {
    let items: {}[];

    try {
      const query = this.connection('tv_episodes')
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
      items: items.map(this.deserialize.bind(this)),
      totalItems: await this.countByTvSeasonId(tvSeasonId)
    };
  }

  async countByTvSeasonId(tvSeasonId: UUID) {
    try {
      const result = await this.connection('tv_episodes')
        .where('tv_season_id', tvSeasonId)
        .count()
        .first();

      return Number(result?.count);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }
  }

  private async findOne(query: {}) {
    let result: {};

    try {
      result = await this.connection('tv_episodes')
        .where(query)
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new TVEpisodeNotFound(query);
    }

    return this.deserialize(result);
  }

  private serialize(tvEpisode: TVEpisode) {
    return TVEpisodeSerializer.toJSON(tvEpisode);
  }

  private deserialize(data: {}) {
    return TVEpisodeSerializer.fromJSON(data);
  }
}

export default SQLTVEpisodeStore;
