import { UUID } from '../common';

export default interface TVSerieEntity {
  id?: UUID;
  imdbId: string;
  name: string;
  plot: string;
  years: {
    from: string;
    to: string;
  };
  rated: string;
  genre: string[];
  writers: string[];
  actors: string[];
  poster: string;
  imdbRating: string;
  totalSeasons: number;
  releasedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
