
import { CouldNotCreateWatchlist } from './errors';
import { User, Watchlist } from './entities';
import { Database } from '../../types/database';
import { Privacity } from '../../types/entities';

class CreateWatchlist {
  database: Database;
  user: User;
  name: string;
  privacity: Privacity;
  description: string;

  constructor(
    database: Database,
    user: User,
    name: string,
    privacity: Privacity,
    description?: string
  ) {
    this.database = database;
    this.user = user;
    this.name = name;
    this.privacity = privacity;
    this.description = description || '';
  }

  async execute() {
    const watchlist = new Watchlist({
      name: this.name,
      privacity: this.privacity,
      description: this.description,
      userId: this.user.id
    });

    try {
      return await this.database.watchlists.create(watchlist);
    } catch (error: any) {
      throw new CouldNotCreateWatchlist(error);
    }
  }
}

export default CreateWatchlist;
