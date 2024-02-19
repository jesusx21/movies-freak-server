import Store from './store';
import { User } from '../../../app/moviesFreak/entities';
import {
  EmailAlreadyExists,
  NotFound,
  UserNotFound,
  UsernameAlreadyExists
} from '../errors';
import { UUID } from '../../../types/common';

class InMemoryUsersStore {
  private store: Store<User>;

  constructor() {
    this.store = new Store<User>();
  }

  async create(user: User) {
    try {
      await this.findByEmail(user.email);
      throw new EmailAlreadyExists();
    } catch (error: any) {
      if (!(error instanceof UserNotFound)) {
        throw error;
      }
    }

    try {
      await this.findByUsername(user.username);
      throw new UsernameAlreadyExists();
    } catch (error: any) {
      if (!(error instanceof UserNotFound)) {
        throw error;
      }
    }

    return this.store.create(user);
  }

  async findById(userId: UUID) {
    try {
      return await this.store.findById(userId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new UserNotFound({ id: userId });
      }

      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.store.findOne({ email });
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new UserNotFound({ email });
      }

      throw error;
    }
  }

  async findByUsername(username: string) {
    try {
      return await this.store.findOne({ username });
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new UserNotFound({ username });
      }

      throw error;
    }
  }
}

export default InMemoryUsersStore;
