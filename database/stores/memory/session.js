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

  async update(session) {
    let sessionToUpdate;

    try {
      sessionToUpdate = await this._store.findById(session.id);
    } catch (error) {
      if (error instanceof NotFound) {
        throw new SessionNotFound(session.id);
      }
    }

    sessionToUpdate._token = session.token;
    sessionToUpdate._expiresAt = session.expiresAt;
    sessionToUpdate._isActive = session.isActive;

    return this._store.update(sessionToUpdate);
  }
}
