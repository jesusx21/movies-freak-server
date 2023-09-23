import Store from './store';

export default class InMemorySessionsStore {
  constructor() {
    this.store = new Store();
  }

  create(film) {
    return this._store.create(film);
  }
}
