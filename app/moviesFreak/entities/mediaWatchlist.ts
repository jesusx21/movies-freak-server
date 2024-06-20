import Entity from './entity';
import Film from './film';
import TVEpisode from './tvEpisode';
import { Json, UUID } from '../../../types/common';
import {
  FilmAlreadySet,
  InvalidMediaType,
  TVEpisodeAlreadySet
} from './errors';

export enum MediaType {
  tvEpisode,
  film
}

export default class MediaWatchlist extends Entity {
  private _filmId?: UUID;
  private _tvEpisodeId?: UUID;

  watchlistId: UUID;
  index: number;
  watched: boolean;
  mediaType: MediaType;
  film?: Film;
  tvEpisode?: TVEpisode;

  constructor(args: Json) {
    super(args.id, args.createdAt, args.updatedAt);

    this.watchlistId = args.watchlistId;
    this._filmId = args.filmId;
    this._tvEpisodeId = args.tvEpisodeId;
    this.mediaType = args.mediaType
    this.index = args.index;
    this.watched = args.watched;
  }

  get filmId() {
    return this._filmId;
  }

  get tvEpisodeId() {
    return this._tvEpisodeId;
  }

  isFilm() {
    return this.mediaType === MediaType.film;
  }

  isTVEpisode() {
    return this.mediaType === MediaType.tvEpisode;
  }

  setFilm(film: Film) {
    if (!this.isFilm()) {
      throw new InvalidMediaType();
    }

    if (this.film) {
      throw new FilmAlreadySet();
    }

    this.film = film;
    this._filmId = film.id;
  }

  setTVEpisode(tvEpisode: TVEpisode) {
    if (!this.isTVEpisode()) {
      throw new InvalidMediaType();
    }

    if (this.tvEpisode) {
      throw new TVEpisodeAlreadySet();
    }

    this.tvEpisode = tvEpisode;
    this._tvEpisodeId = tvEpisode.id;
  }
}
