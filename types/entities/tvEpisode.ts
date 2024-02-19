import { UUID } from '../common';

export default interface TVEpisodeEntity {
  id?: UUID;
  imdbId: string;
  name: string;
  year: number;
  seasonNumber: number;
  episodeNumber: number;
  genre: string[];
  director: string;
  writers: string[];
  actors: string[];
  plot: string;
  languages: string[];
  country: string;
  poster: string;
  awards: string;
  imdbRating: string;
  releasedAt: Date;
  tvSerieId?: UUID;
  tvSeasonId?: UUID;
  createdAt?: Date;
  updatedAt?: Date;
};
