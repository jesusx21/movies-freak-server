import Entity from './entity';
import { FilmAlreadySet, TVEpisodeAlreadySet } from './errors';

export default class MediaWatchlist extends Entity {
  constructor({
    id,
    watchlistId,
    filmId,
    tvEpisodeId,
    index,
    watched,
    createdAt,
    updatedAt
  }) {
    super(id, createdAt, updatedAt);

    this.watchlistId = watchlistId;
    this.filmId = filmId;
    this.tvEpisodeId = tvEpisodeId;
    this.index = index;
    this.watched = watched;

    this.film;
    this.tvEpisode;
  }

  get mediaType() {
    if (this.filmId) {
      return 'film';
    }

    if (this.tvEpisode) {
      return 'tvEpisode';
    }

    return 'N/A';
  }

  setFilm(film) {
    if (this.film) {
      throw new FilmAlreadySet();
    }

    if (this.tvEpisode) {
      throw new TVEpisodeAlreadySet();
    }

    this.film = film;
    this.filmId = film.id;
  }

  setTVEpisode(tvEpisode) {
    if (this.film) {
      throw new FilmAlreadySet();
    }

    if (this.tvEpisode) {
      throw new TVEpisodeAlreadySet();
    }

    this.tvEpisode = tvEpisode;
    this.tvEpisodeId = tvEpisode.id;
  }
}
