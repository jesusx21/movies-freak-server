import { Knex } from 'knex';
import { omit } from 'lodash';

import { SQLDatabaseException } from './errors';
import { Watchlist } from '../../../app/moviesFreak/entities';
import { WatchlistSerializer } from './serializers';

interface watchlistRecord {
  total_films?: number;
  total_tv_episodes?: number;
}

class SQLWatchlistsStore {
  private connection: Knex;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  async create(watchlist: Watchlist) {
    const dataToInsert = this.serialize(watchlist);

    let result: watchlistRecord;

    try {
      [result] = await this.connection('watchlists')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  private serialize(watchlist: Watchlist): watchlistRecord {
    const data = WatchlistSerializer.toJSON(watchlist);

    return omit(data, ['total_films', 'total_tv_episodes']);
  }

  private async deserialize(data: watchlistRecord) {
    data.total_films = 0;
    data.total_tv_episodes = 0;

    return WatchlistSerializer.fromJSON(data);
  }
}

export default SQLWatchlistsStore;
