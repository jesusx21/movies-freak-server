import { UUID } from '../../../types/common';
import { TVSeasonEntity } from '../../../types/entities';
import Entity from './entity';

class TVSeason extends Entity implements TVSeasonEntity {
  tvSerieId?: UUID;
  seasonNumber: number;
  plot: string;
  poster: string;
  releasedAt?: Date;

  constructor(args: TVSeasonEntity) {
    super(args.id, args.createdAt, args.updatedAt);

    this.tvSerieId = args.tvSerieId;
    this.seasonNumber = args.seasonNumber;
    this.plot = args.plot;
    this.poster = args.poster;
    this.releasedAt = args.releasedAt;
  }
}

export default TVSeason;
