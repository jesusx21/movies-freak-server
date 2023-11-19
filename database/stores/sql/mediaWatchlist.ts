import { Knex } from 'knex';

import { MediaWatchlist } from '../../../app/moviesFreak/entities';
import { MediaWatchlistSerializer } from './serializers';
import { SQLDatabaseException } from './errors';

class SQLMediaWatchlistsStore {
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
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  private serialize(mediaWatchlist: MediaWatchlist) {
    return MediaWatchlistSerializer.toJSON(mediaWatchlist);
  }

  private async deserialize(data: {}) {
    const mediaWatchlist = MediaWatchlistSerializer.fromJSON(data);

    if (mediaWatchlist.mediaType === 'film') {
      mediaWatchlist.film = await this.database
        .films
        .findById(mediaWatchlist.filmId);
    } else if (mediaWatchlist.mediaType === 'tvEpisode') {
      mediaWatchlist.tvEpisode = await this.database
        .tvEpisodes
        .findById(mediaWatchlist.tvEpisodeId);
    }

    return mediaWatchlist;
  }
}

export default SQLMediaWatchlistsStore;
