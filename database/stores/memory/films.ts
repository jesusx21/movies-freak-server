import Store from './store';
import { Film } from '../../../app/moviesFreak/entities';
import { FilmNotFound, NotFound } from '../errors';
import { QueryOptions } from '../interfaces';
import { UUID } from '../../../typescript/customTypes';

class InMemoryFilmsStore {
  private store: Store<Film>;

  constructor() {
    this.store = new Store<Film>();
  }

  create(film: Film) {
    return this.store.create(film);
  }

  async findById(filmId: UUID) {
    try {
      return await this.store.findById(filmId);
    } catch (error) {
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
