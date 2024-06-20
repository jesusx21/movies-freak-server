import { Knex } from 'knex';
import { omit } from 'lodash';

import { SQLDatabaseException } from './errors';
import { Watchlist } from '../../../app/moviesFreak/entities';
import { WatchlistSerializer } from './serializers';
import { Json, UUID } from '../../../types/common';
import { WatchlistNotFound } from '../errors';

class SQLWatchlistsStore {
  private connection: Knex;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  async create(watchlist: Watchlist) {
    const dataToInsert = this.serialize(watchlist);

    let result: Json;

    try {
      [result] = await this.connection('watchlists')
        .returning('*')
        .insert(dataToInsert);
    } catch (error: any) {
      console.log(error)
      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  findById(watchlistId: UUID) {
    return this.findOne({ id: watchlistId });
  }

  private async findOne(query: {}) {
    let result: {};

    try {
      result = await this.connection('watchlists')
        .where(query)
        .first();
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new WatchlistNotFound(query);
    }

    return this.deserialize(result);
  }

  private serialize(watchlist: Watchlist): Json {
    const data = WatchlistSerializer.toJSON(watchlist);

    return omit(data, ['total_films', 'total_tv_episodes']);
  }

  private deserialize(data: Json) {
    data.total_films = 0;
    data.total_tv_episodes = 0;

    return WatchlistSerializer.fromJSON(data);
  }
}

export default SQLWatchlistsStore;
