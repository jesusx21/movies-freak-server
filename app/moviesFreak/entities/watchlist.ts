import Entity from './entity';
import { MarathonType, UUID } from '../../../typescript/customTypes';

export interface WatchlistParams {
  id?: UUID;
  name: string;
  type: MarathonType;
  description: string;
  totalFilms?: number;
  totalTVEpisodes?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

class Watchlist extends Entity {
  name: string;
  type: MarathonType;
  description: string;
  totalFilms?: number;
  totalTVEpisodes?: number;

  constructor(args: WatchlistParams) {
    super(args.id, args.createdAt, args.updatedAt);

    this.name = args.name;
    this.type = args.type;
    this.description = args.description;
    this.totalFilms = args.totalFilms;
    this.totalTVEpisodes = args.totalTVEpisodes;
  }
}

export default Watchlist;
