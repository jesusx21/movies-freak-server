import { UUID } from '../common';

export default interface MediaWatchlistEntity {
  id?: UUID;
  watchlistId: UUID;
  filmId?: UUID;
  tvEpisodeId?: UUID;
  index: number;
  watched: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
