import Entity from './entity';
import { MovieSchema } from 'database/schemas';

export default class Movie extends Entity {
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

  constructor(params: MovieSchema) {
    super(params.id, params.createdAt, params.updatedAt);

    this.name = params.name;
    this.plot = params.plot;
    this.title = params.title;
    this.year = params.year;
    this.rated = params.rated;
    this.runtime = params.runtime;
    this.director = params.director;
    this.poster = params.poster;
    this.production = params.production;
    this.genre = params.genre;
    this.writers = params.writers;
    this.actors = params.actors;
    this.imdbId = params.imdbId;
    this.imdbRating = params.imdbRating;
  }
}
