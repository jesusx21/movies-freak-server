import Database from '../../database/stores/memory';
import { MarathonType } from '../../typescript/customTypes';
import { Watchlist } from './entities';
import { CouldNotCreateWatchlist, InvalidType } from './errors';



class CreateWatchlist {
  private database: Database;
  private name: string;
  private type: MarathonType;
  private description: string;

  constructor(database: Database, name: string, type: MarathonType, description?: string) {
    this.database = database;
    this.name = name;
    this.type = type;
    this.description = description || '';
  }

  async execute() {
    const watchlist = new Watchlist({
      name: this.name,
      type: this.type,
      description: this.description
    });

    try {
      return await this.database.watchlists.create(watchlist);
    } catch (error) {
      throw new CouldNotCreateWatchlist(error);
    }
  }
}

export default CreateWatchlist;
