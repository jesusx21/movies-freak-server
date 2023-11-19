import Store from './store';
import { NotFound, SessionNotFound } from '../errors';
import { Session } from '../../../app/moviesFreak/entities';
import { UUID } from '../../../typescript/customTypes';

class InMemorySessionsStore {
  private store: Store<Session>;

  constructor() {
    this.store = new Store<Session>();
  }

  create(session: Session) {
    return this.store.create(session);
  }

  async findActiveByUserId(userId: UUID) {
    try {
      return await this.store.findOne({ 'user.id': userId });
    } catch (error) {
      if (error instanceof NotFound) {
        throw new SessionNotFound(userId);
      }

      throw error;
    }
  }

  async update(session: Session) {
    let sessionToUpdate: Session;

    try {
      return await this.store.update(session);
    } catch (error) {
      if (error instanceof NotFound) {
        throw new SessionNotFound(session.id);
      }

      throw error;
    }
  }
}

export default InMemorySessionsStore;
