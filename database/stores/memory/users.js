import Store from './store';
import {
  EmailAlreadyExists,
  NotFound,
  UserNotFound,
  UsernameAlreadyExists
} from '../errors';

export default class InMemoryUsersStore {
  constructor() {
    this._store = new Store();
  }

  async create(user) {
    try {
      await this.findByEmail(user.email);
      throw EmailAlreadyExists();
    } catch (error) {
      if (!(error instanceof UserNotFound)) {
        throw error;
      }
    }

    try {
      await this.findByUsername(user.username);
      throw UsernameAlreadyExists();
    } catch (error) {
      if (!(error instanceof UserNotFound)) {
        throw error;
      }
    }

    return this._store.create(user);
  }

  async findById(userId) {
    try {
      return await this._store.findById(userId);
    } catch (error) {
      if (error instanceof NotFound) {
        throw new UserNotFound(userId);
      }

      throw error;
    }
  }

  async findByEmail(email) {
    try {
      return await this._store.findOne({ email });
    } catch (error) {
      if (error instanceof NotFound) {
        throw new UserNotFound(email);
      }

      throw error;
    }
  }

  async findByUsername(username) {
    try {
      return await this._store.findOne({ username });
    } catch (error) {
      if (error instanceof NotFound) {
        throw new UserNotFound(username);
      }

      throw error;
    }
  }
}
