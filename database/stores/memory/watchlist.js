import Store from './store';

export default class InMemoryWatchlistStore {
  constructor() {
    this._store = new Store();
  }

  create(tvSeason) {
    return this._store.create(tvSeason);
  }
}
