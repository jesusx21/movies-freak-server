import { UUID } from '../common';
import { Privacity } from './moviesFreak';

type WatchlistEntity = {
  id?: UUID;
  name: string;
  privacity: Privacity;
  userId: UUID;
  description: string;
  totalFilms?: number;
  totalTVEpisodes?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default  WatchlistEntity
