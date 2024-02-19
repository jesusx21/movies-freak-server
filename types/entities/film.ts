import { UUID } from '../common';

export default interface FilmEntity {
  id?: UUID;
  name: string;
  plot: string;
  title: string;
  year: string;
  rated: string;
  runtime: string;
  director: string;
  poster: string;
  production: string;
  genre: string[];
  writers: string[];
  actors: string[];
  imdbId: string;
  imdbRating: string;
  createdAt?: Date;
  updatedAt?: Date;
};
