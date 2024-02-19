import { UUID } from '../common';
import { MarathonType } from './moviesFreak';

type WatchlistEntity = {
  id?: UUID;
  name: string;
  type: MarathonType;
  description: string;
  totalFilms?: number;
  totalTVEpisodes?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default  WatchlistEntity
