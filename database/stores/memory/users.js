import Store from './store';
import { NotFound, UserNotFound } from '../errors';

export default class InMemoryUsersStore {
  constructor() {
    this._store = new Store();
  }

  create(user) {
    return this._store.create(user);
  }

  async findById(userId) {
    try {
      return await this._store.findById(userId);
    } catch (error) {
      if (error instanceof NotFound) {
        throw UserNotFound(userId);
      }

      throw error;
    }
  }
}
