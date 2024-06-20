import { isNil } from 'lodash';
import { NotFound } from '../../database/stores/errors';
import { UUID } from '../../types/common';
import { Database } from '../../types/database';
import { IMDBGateway } from '../imdb/factory';
import CreateFilm from './createFilm';
import { Film, TVEpisode, Watchlist } from './entities';
import MediaWatchlist, { MediaType } from './entities/mediaWatchlist';
import { CouldNotAddMediaWatchlist, CouldNotGetFilm, CouldNotGetTVEpisode, CouldNotGetWatchlist, FilmNotFound, InvalidMediaIndex, TVEpisodetNotFound, WatchlistNotFound } from './errors';

export default class AddMediaWatchlist {
  database: Database;
  imdb: IMDBGateway;
  watchlistId: UUID;
  mediaType: MediaType;
  index: number;
  imdbId: string;

  film?: Film;
  tvEpisode?: TVEpisode;

  constructor(
    database: Database,
    imdb: IMDBGateway,
    watchlistId: UUID,
    mediaType: MediaType,
    index: number,
    imdbId: string
  ) {
    this.database = database;
    this.imdb = imdb;
    this.watchlistId = watchlistId;
    this.mediaType = mediaType;
    this.index = index;
    this.imdbId = imdbId;
  }

  async execute() {
    let watchlist: Watchlist;

    if (this.index < 0) {
      throw new InvalidMediaIndex(this.index)
    }

    const index = await this.getIndex();

    try {
      watchlist = await this.database
        .watchlists
        .findById(this.watchlistId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new WatchlistNotFound();
      }

      throw new CouldNotGetWatchlist(error);
    }

    const mediaWatchlist = new MediaWatchlist({
      index,
      watchlistId: watchlist.id,
      mediaType: this.mediaType,
      watched: false
    });

    if (mediaWatchlist.isFilm()) {
      mediaWatchlist.film = await this.getFilm();
    }

    if (mediaWatchlist.isTVEpisode()) {
      mediaWatchlist.tvEpisode = await this.getTVEpisode();
    }

    try {
      return await this.database
        .mediaWatchlists
        .create(mediaWatchlist);
    } catch (error: any) {
      throw new CouldNotAddMediaWatchlist(error);
    }
  }

  private async getIndex() {
    const nextIndex = await this.getNextIndex();

    if (isNil(this.index) || this.index >= nextIndex) {
      return nextIndex;
    }

    const newIndex = Math.min(this.index, nextIndex);

    try {
      await this.database
        .mediaWatchlists
        .updateIndexBackwards(this.watchlistId, newIndex, nextIndex)
    } catch (error: any) {
      throw new CouldNotAddMediaWatchlist(error);
    }

    return newIndex;
  }

  private async getNextIndex() {
    let latestIndex: number | undefined;

    try {
      latestIndex = await this.database
        .mediaWatchlists
        .getLatestIndex(this.watchlistId);
    } catch (error: any) {
      throw new CouldNotAddMediaWatchlist(error);
    }

    return !isNil(latestIndex) ? latestIndex + 1 : 0;
  }

  private async getFilm() {
    try {
      return await this.database
        .films
        .findByIMDBId(this.imdbId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        const createFilm = new CreateFilm(this.database, this.imdb, this.imdbId);

        return await createFilm.execute();
      }

      throw new CouldNotGetFilm(error);
    }
  }

  private async getTVEpisode() {
    try {
      return await this.database
        .tvEpisodes
        .findByIMDBId(this.imdbId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new TVEpisodetNotFound();
      }

      throw new CouldNotGetTVEpisode(error);
    }
  }
}
