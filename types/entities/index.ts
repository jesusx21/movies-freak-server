import {
  Film,
  MediaWatchlist,
  Session,
  TVEpisode,
  TVSeason,
  TVSerie,
  User,
  Watchlist
} from '../../app/moviesFreak/entities';

export type { default as FilmEntity } from './film';
export type { default as MediaWatchlistEntity } from './mediaWatchlist';
export * from './moviesFreak';
export type { default as SessionEntity } from './session';
export type { default as TVEpisodeEntity } from './tvEpisode';
export type { default as TVSeasonEntity } from './tvSeason';
export type { default as TVSerieEntity } from './tvSerie';
export type { Password, default as UserEntity } from './user';
export type { default as WatchlistEntity } from './watchlist';

export type Entity = (
  Film |
  MediaWatchlist |
  Session |
  TVEpisode |
  TVSeason |
  TVSerie |
  User |
  Watchlist
)
