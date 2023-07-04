import { FilmNotFound, NotFound } from '../errors';
import Store from './store';

export default class InMemoryFilmsStore {
  constructor() {
    this._store = new Store();
  }

  create(film) {
    return this._store.create(film);
  }

  async findById(filmId) {
    try {
      return await this._store.findById(filmId);
    } catch (error) {
      if (error instanceof NotFound) {
        throw new FilmNotFound(filmId);
      }

      throw error
    }
  }
}