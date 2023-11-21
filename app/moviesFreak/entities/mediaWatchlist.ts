import Entity from './entity';
import Film from './film';
import TVEpisode from './tvEpisode';
import { FilmAlreadySet, TVEpisodeAlreadySet } from './errors';
import { UUID } from '../../../typescript/customTypes';

export interface MediaWatchlistParams {
  id?: UUID;
  watchlistId: UUID;
  filmId?: UUID;
  tvEpisodeId?: UUID;
  index: number;
  watched: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

class MediaWatchlist extends Entity {
  private _filmId?: UUID;
  private _tvEpisodeId?: UUID;

  watchlistId: UUID;
  index: number;
  watched: boolean;
  film?: Film;
  tvEpisode?: TVEpisode;

  constructor(args: MediaWatchlistParams) {
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
