import Entity from './entity';
import Film from './film';
import TVEpisode from './tvEpisode';
import { FilmAlreadySet, TVEpisodeAlreadySet } from './errors';
import { MediaWatchlistEntity } from '../../../types/entities';
import { UUID } from '../../../types/common';

class MediaWatchlist extends Entity implements MediaWatchlistEntity {
  private _filmId?: UUID;
  private _tvEpisodeId?: UUID;

  watchlistId: UUID;
  index: number;
  watched: boolean;
  film?: Film;
  tvEpisode?: TVEpisode;

  constructor(args: MediaWatchlistEntity) {
    super(args.id, args.createdAt, args.updatedAt);

    this.watchlistId = args.watchlistId;
    this._filmId = args.filmId;
    this._tvEpisodeId = args.tvEpisodeId;
    this.index = args.index;
    this.watched = args.watched;
  }

  get filmId() {
    return this._filmId;
  }

  get tvEpisodeId() {
    return this._tvEpisodeId;
  }

  get mediaType() {
    if (this._filmId) {
      return 'film';
    }

    if (this.tvEpisode) {
      return 'tvEpisode';
    }

    return 'N/A';
  }

  setFilm(film: Film) {
    if (this.film) {
      throw new FilmAlreadySet();
    }

    if (this.tvEpisode) {
      throw new TVEpisodeAlreadySet();
    }

    this.film = film;
    this._filmId = film.id;
  }

  setTVEpisode(tvEpisode: TVEpisode) {
    if (this.film) {
      throw new FilmAlreadySet();
    }

    if (this.tvEpisode) {
      throw new TVEpisodeAlreadySet();
    }

    this.tvEpisode = tvEpisode;
    this._tvEpisodeId = tvEpisode.id;
  }
}

export default MediaWatchlist;
