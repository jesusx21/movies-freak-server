import { UUID } from '../common';

export default interface TVSeasonEntity {
  id?: UUID;
  tvSerieId?: UUID;
  seasonNumber: number;
  plot: string;
  poster: string;
  releasedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
