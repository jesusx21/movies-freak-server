import Entity from './entity';
import TVSeason from './tvSeason';
import { UUID } from '../../../typescript/customTypes';

interface TVSerieParams {
  id?: UUID;
  imdbId: string;
  name: string;
  plot: string;
  years: string;
  rated: string;
  genre: string[];
  writers: string[];
  actors: string[];
  poster: URL;
  imdbRating: string;
  totalSeasons: number;
  releasedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class TVSerie extends Entity {
  imdbId?: string;
  name?: string;
  plot?: string;
  years?: string;
  rated?: string;
  genre?: string[];
  writers?: string[];
  actors?: string[];
  poster?: URL;
  imdbRating?: string;
  totalSeasons?: number;
  releasedAt?: Date;
  private tvSeasons: TVSeason[];

  constructor(args: TVSerieParams) {
    super(args.id, args.createdAt, args.updatedAt);

    this.imdbId = args.imdbId;
    this.name = args.name;
    this.plot = args.plot;
    this.years = args.years;
    this.rated = args.rated;
    this.genre = args.genre;
    this.writers = args.writers;
    this.actors = args.actors;
    this.poster = args.poster;
    this.imdbRating = args.imdbRating;
    this.totalSeasons = args.totalSeasons;
    this.releasedAt = args.releasedAt;

    this.tvSeasons = [];
  }

  addTvSeason(tvSeason: TVSeason) {
    this.tvSeasons.push(tvSeason);
  }
}

export default TVSerie;
