import Store from './store';

export default class InMemoryUsersStore {
  constructor() {
    this._store = new Store();
  }

  create(user) {
    return this._store.create(user);
  }
}
