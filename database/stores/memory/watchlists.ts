import Store from './store';
import { Watchlist } from '../../../app/moviesFreak/entities';
import { UUID } from '../../../types/common';
import { NotFound, WatchlistNotFound } from '../errors';

class InMemoryWatchlistStore {
  private store: Store<Watchlist>;

  constructor() {
    this.store = new Store<Watchlist>();
  }

  create(watchlist: Watchlist) {
    return this.store.create(watchlist);
  }

  async findById(watchlistId: UUID) {
    try {
      return await this.store.findById(watchlistId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new WatchlistNotFound(watchlistId);
      }

      throw error;
    }
  }
}

export default InMemoryWatchlistStore;
