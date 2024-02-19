import Entity from './entity';
import { FilmEntity } from '../../../types/entities';

class Film extends Entity implements FilmEntity {
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

  constructor(args: FilmEntity) {
    super(args.id, args.createdAt, args.updatedAt);

    this.name = args.name;
    this.plot = args.plot;
    this.title = args.title;
    this.year = args.year;
    this.rated = args.rated;
    this.runtime = args.runtime;
    this.director = args.director;
    this.poster = args.poster;
    this.production = args.production;
    this.genre = args.genre;
    this.writers = args.writers;
    this.actors = args.actors;
    this.imdbId = args.imdbId;
    this.imdbRating = args.imdbRating;
  }
}

export default Film;
