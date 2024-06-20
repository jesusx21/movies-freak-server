import { Knex } from 'knex';

import { MediaWatchlist } from '../../../app/moviesFreak/entities';
import { MediaWatchlistSerializer } from './serializers';
import { SQLDatabaseException } from './errors';
import { UUID } from '../../../types/common';

export default class SQLMediaWatchlistsStore {
  private connection: Knex;
  private database: any;

  constructor(connection: Knex, database: any) {
    this.connection = connection;
    this.database = database;
  }

  async create(mediaWatchlist: MediaWatchlist) {
    const dataToInsert = this.serialize(mediaWatchlist);

    let result: {};

    try {
      [result] = await this.connection('media_watchlists')
        .returning('*')
        .insert(dataToInsert);
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  async getLatestIndex(watchlistId: UUID): Promise<number> {
    try {
      const result = await this.connection('media_watchlists')
        .where('watchlist_id', watchlistId)
        .max('index')
        .first();

      return result?.max;
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }
  }

  async updateIndexBackwards(watchlistId: UUID, newIndex: number, oldIndex: number = 1) {
    try {
      await this.connection('media_watchlists')
        .where('watchlist_id', watchlistId)
        .andWhere('index', '>=', newIndex)
        .andWhere('index', '<', oldIndex)
        .update('index', this.connection.raw('media_watchlists.index + 1'));
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }
  }

  private serialize(mediaWatchlist: MediaWatchlist) {
    return MediaWatchlistSerializer.toJSON(mediaWatchlist);
  }

  private async deserialize(data: {}) {
    const mediaWatchlist = MediaWatchlistSerializer.fromJSON(data);

    if (mediaWatchlist.isFilm()) {
      mediaWatchlist.film = await this.database
        .films
        .findById(mediaWatchlist.filmId);
    } else if (mediaWatchlist.isTVEpisode()) {
      mediaWatchlist.tvEpisode = await this.database
        .tvEpisodes
        .findById(mediaWatchlist.tvEpisodeId);
    }

    return mediaWatchlist;
  }
}
