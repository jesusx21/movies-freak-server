import { omit } from 'lodash';
import { WatchlistSerializer } from './serializers';
import { SQLDatabaseException } from './errors';

export default class SQLWatchlistsStore {
  constructor(connection) {
    this._connection = connection;
  }

  async create(watchlist) {
    const dataToInsert = this._serialize(watchlist);

    let result;

    try {
      [result] = await this._connection('watchlists')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this._deserialize(result);
  }

  _serialize(watchlist) {
    const data = WatchlistSerializer.toJSON(watchlist);

    return omit(data, ['total_films', 'total_tv_episodes']);
  }

  async _deserialize(data) {
    Object.assign(data, { total_films: 0, total_tv_episodes: 0 });

    return WatchlistSerializer.fromJSON(data);
  }
}
