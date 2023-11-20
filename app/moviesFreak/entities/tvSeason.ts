import Entity from './entity';
import { UUID } from '../../../typescript/customTypes';

interface TVSeasonParams {
  id?: UUID;
  tvSerieId?: UUID;
  seasonNumber: number;
  plot: string;
  poster: URL;
  releasedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

class TVSeason extends Entity {
  tvSerieId?: UUID;
  seasonNumber: number;
  plot: string;
  poster: URL;
  releasedAt?: Date;

  constructor(args: TVSeasonParams) {
    super(args.id, args.createdAt, args.updatedAt);

    this.tvSerieId = args.tvSerieId;
    this.seasonNumber = args.seasonNumber;
    this.plot = args.plot;
    this.poster = args.poster;
    this.releasedAt = args.releasedAt;
  }
}

export default TVSeason;
