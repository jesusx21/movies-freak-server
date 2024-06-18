import Entity from './entity';
import { Privacity } from '../../../types/entities';
import { Json, UUID } from '../../../types/common';

class Watchlist extends Entity {
  name: string;
  privacity: Privacity;
  description: string;
  userId: UUID;
  totalFilms?: number;
  totalTVEpisodes?: number;

  constructor(args: Json) {
    super(args.id, args.createdAt, args.updatedAt);

    this.name = args.name;
    this.privacity = args.privacity;
    this.description = args.description;
    this.userId = args.userId;
    this.totalFilms = args.totalFilms;
    this.totalTVEpisodes = args.totalTVEpisodes;
  }
}

export default Watchlist;
