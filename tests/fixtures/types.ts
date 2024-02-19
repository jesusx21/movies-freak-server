import { UUID } from '../../types/common';

export type Type = {
  type: string;
};

export type FilmFixture = {
  id?: UUID;
  name?: string;
  plot?: string;
  title?: string;
  year?: string;
  rated?: string;
  runtime?: string;
  director?: string;
  poster?: string;
  genre?: string[];
  writers?: string[];
  actors?: string[];
  imdbId?: string;
  imdbRating?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type MediaWatchlistFixture = {
  id?: UUID;
  watchlistId?: UUID;
  filmId?: UUID;
  tvEpisodeId?: UUID;
  index?: number;
  watched?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type SessionFixture = {
  id?: UUID;
  token?: string;
  expiresAt?: Date;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TVEpisodeFixture = {
  id?: UUID;
  imdbId?: string;
  name?: string;
  year?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  genre?: string[];
  director?: string;
  writers?: string[];
  actors?: string[];
  plot?: string;
  languages?: string[];
  country?: string;
  poster?: string;
  awards?: string;
  imdbRating?: string;
  releasedAt?: Date;
  tvSerieId?: UUID;
  tvSeasonId?: UUID;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TVSeasonFixture = {
  id?: UUID;
  tvSerieId?: UUID;
  plot?: string;
  poster?: string;
  seasonNumber?: number;
  releasedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TVSerieFixture = {
  id?: UUID;
  name?: string;
  plot?: string;
  rated?: string;
  genre?: string[];
  writers?: string[];
  actors?: string[];
  imdbId?: string;
  imdbRating?: string;
  totalSeasons?: number;
  releasedAt?: Date;
  years?: {
    from: string;
    to: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type UserFixture = {
  id?: UUID;
  name?: string;
  username?: string;
  lsatName?: string;
  email?: string;
  birthdate?: Date;
  password?: {
    salt?: string;
    hash?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type WatchlistFixture = {
  id?: UUID;
  name?: string;
  type?: string;
  description?: string;
  totalFilms?: number;
  totalTVEpisodes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
