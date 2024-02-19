import Entity from './entity';
import TVSeason from './tvSeason';
import { TVSerieEntity } from '../../../types/entities';


class TVSerie extends Entity implements TVSerieEntity {
  imdbId: string;
  name: string;
  plot: string;
  rated: string;
  genre: string[];
  writers: string[];
  actors: string[];
  poster: string;
  imdbRating: string;
  totalSeasons: number;
  releasedAt: Date;
  years: {
    from: string;
    to: string;
  };

  private tvSeasons: TVSeason[];

  constructor(args: TVSerieEntity) {
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
