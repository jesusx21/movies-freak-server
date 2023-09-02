import { MediaWatchlistSerializer } from './serializers';
import { SQLDatabaseException } from './errors';

export default class SQLMediaWatchlistsStore {
  constructor(connection, database) {
    this._connection = connection;
    this._database = database;
  }

  async create(mediaWatchlist) {
    const dataToInsert = this._serialize(mediaWatchlist);
    console.log(dataToInsert)

    let result;

    try {
      [result] = await this._connection('media_watchlists')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this._deserialize(result);
  }

  _serialize(mediaWatchlist) {
    return MediaWatchlistSerializer.toJSON(mediaWatchlist);
  }

  async _deserialize(data) {
    const mediaWatchlist = MediaWatchlistSerializer.fromJSON(data);

    if (mediaWatchlist.mediaType === 'film') {
      mediaWatchlist.film = await this._database
        .films
        .findById(mediaWatchlist.filmId);
    } else if (mediaWatchlist.mediaType === 'tvEpisode') {
      mediaWatchlist.tvEpisode = await this._database
        .tvEpisodes
        .findById(mediaWatchlist.tvEpisodeId);
    }

    return mediaWatchlist;
  }
}
