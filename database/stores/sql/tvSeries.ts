import { Knex } from 'knex';

import { IMDBIdAlreadyExists, TVSerieNotFound } from '../errors';
import { QueryOptions, QueryResponse } from '../../../types/database';
import { SQLDatabaseException } from './errors';
import { TVSerie } from '../../../app/moviesFreak/entities';
import { TVSerieSerializer } from './serializers';
import { UUID } from '../../../types/common';

class SQLTVSeriesStore {
  private connection: Knex;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  async create(tvSerie: TVSerie) {
    const dataToInsert = this.serialize(tvSerie);

    let result: {};

    try {
      [result] = await this.connection('tv_series')
        .returning('*')
        .insert(dataToInsert);
    } catch (error: any) {
      if (error.constraint === 'tv_series_imdb_id_unique') {
        throw new IMDBIdAlreadyExists(tvSerie.imdbId);
      }

      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  findById(tvSerieId: UUID) {
    return this.findOne({ id: tvSerieId });
  }

  async find(options: QueryOptions = {}): Promise<QueryResponse<TVSerie>> {
    let items: {}[];

    try {
      const query = this.connection('tv_series');

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
      totalItems: await this.count()
    };
  }

  async count() {
    try {
      const result = await this.connection('tv_series')
        .count()
        .first();

      return Number(result?.count);
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }
  }

  private async findOne(query: {}) {
    let result: {};

    try {
      result = await this.connection('tv_series')
        .where(query)
        .first();
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new TVSerieNotFound(query);
    }

    return this.deserialize(result);
  }

  private serialize(tvSerie: TVSerie) {
    return TVSerieSerializer.toJSON(tvSerie);
  }

  private deserialize(data: {}) {
    return TVSerieSerializer.fromJSON(data);
  }
}

export default SQLTVSeriesStore;
