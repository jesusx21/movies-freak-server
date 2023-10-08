import { NotFound, SessionNotFound } from '../errors';
import Store from './store';

export default class InMemorySessionsStore {
  constructor() {
    this._store = new Store();
  }

  create(film) {
    return this._store.create(film);
  }

  async findActiveByUserId(userId) {
    try {
      return await this._store.findOne({ 'user.id': userId });
    } catch (error) {
      if (error instanceof NotFound) {
        throw new SessionNotFound(userId);
      }

      throw error;
    }
  }
}
