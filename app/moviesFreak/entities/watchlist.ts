import Entity from './entity';
import { MarathonType, WatchlistEntity } from '../../../types/entities';

class Watchlist extends Entity {
  name: string;
  type: MarathonType;
  description: string;
  totalFilms?: number;
  totalTVEpisodes?: number;

  constructor(args: WatchlistEntity) {
    super(args.id, args.createdAt, args.updatedAt);

    this.name = args.name;
    this.type = args.type;
    this.description = args.description;
    this.totalFilms = args.totalFilms;
    this.totalTVEpisodes = args.totalTVEpisodes;
  }
}

export default Watchlist;
