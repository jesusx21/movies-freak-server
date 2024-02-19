import Store from './store';
import { Film } from '../../../app/moviesFreak/entities';
import { FilmNotFound, NotFound } from '../errors';
import { QueryOptions } from '../../../types/database';
import { UUID } from '../../../types/common';

class InMemoryFilmsStore {
  private store: Store<Film>;

  constructor() {
    this.store = new Store();
  }

  create(film: Film) {
    return this.store.create(film);
  }

  async findById(filmId: UUID) {
    try {
      return await this.store.findById(filmId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new FilmNotFound(filmId);
      }

      throw error;
    }
  }

  find(options: QueryOptions = {}) {
    return this.store.find(options);
  }
}

export default InMemoryFilmsStore;
