import Store from './store';
import { Watchlist } from '../../../app/moviesFreak/entities';

class InMemoryWatchlistStore {
  private store: Store<Watchlist>;

  constructor() {
    this.store = new Store<Watchlist>();
  }

  create(watchlist: Watchlist) {
    return this.store.create(watchlist);
  }
}

export default InMemoryWatchlistStore;
