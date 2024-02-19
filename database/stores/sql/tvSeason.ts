import { Knex } from 'knex';

import { Json, UUID } from '../../../types/common';
import { QueryOptions, QueryResponse } from '../../../types/database';
import { SQLDatabaseException } from './errors';
import { TVSeason } from '../../../app/moviesFreak/entities';
import { TVSeasonNotFound } from '../errors';
import { TVSeasonSerializer } from './serializers';

class SQLTVSeasonStore {
  private connection: Knex;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  async create(tvSeason: TVSeason) {
    const dataToInsert = this.serialize(tvSeason);

    let result: {};

    try {
      [result] = await this.connection('tv_seasons')
        .returning('*')
        .insert(dataToInsert);
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  findById(tvSeasonId: UUID) {
    return this.findOne({ id: tvSeasonId });
  }

  async findByTVSerieId(tvSerieId: UUID, options: QueryOptions = {}): Promise<QueryResponse<TVSeason>> {
    let items: Json[];

    try {
      const query = this.connection('tv_seasons')
        .where('tv_serie_id', tvSerieId);

      if (options.skip) {
        query.offset(options.skip);
      }

      if (options.limit) {
        query.limit(options.limit);
      }

      items = await query.orderBy('created_at');
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }

    return {
      items: items.map(this.deserialize.bind(this)),
      totalItems: await this.countByTvSerieId(tvSerieId)
    };
  }

  async countByTvSerieId(tvSerieId: UUID) {
    try {
      const result = await this.connection('tv_seasons')
        .where('tv_serie_id', tvSerieId)
        .count()
        .first();

      return Number(result?.count);
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }
  }

  private async findOne(query = {}) {
    let result: {};

    try {
      result = await this.connection('tv_seasons')
        .where(query)
        .first();
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new TVSeasonNotFound(query);
    }

    return this.deserialize(result);
  }

  private serialize(tvSeason: TVSeason) {
    return TVSeasonSerializer.toJSON(tvSeason);
  }

  private deserialize(data: {}) {
    return TVSeasonSerializer.fromJSON(data);
  }
}

export default SQLTVSeasonStore;
