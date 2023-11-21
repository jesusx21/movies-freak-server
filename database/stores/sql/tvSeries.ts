import { Knex } from 'knex';

import { QueryOptions, QueryResponse } from '../interfaces';
import { SQLDatabaseException } from './errors';
import { TVSerie } from '../../../app/moviesFreak/entities';
import { TVSerieNotFound } from '../errors';
import { TVSerieSerializer } from './serializers';
import { UUID } from '../../../typescript/customTypes';

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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
      throw new SQLDatabaseException(error);
    }
  }

  private async findOne(query: {}) {
    let result: {};

    try {
      result = await this.connection('tv_series')
        .where(query)
        .first();
    } catch (error) {
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
