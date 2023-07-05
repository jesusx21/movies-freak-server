import { NotFound, TVSerieNotFound } from '../errors';
import Store from './store';

export default class InMemoryTVSeriesStore {
  constructor() {
    this._store = new Store();
  }

  create(tvSerie) {
    return this._store.create(tvSerie);
  }

  async findById(tvSerieId) {
    try {
      return await this._store.findById(tvSerieId);
    } catch (error) {
      if (error instanceof NotFound) {
        throw new TVSerieNotFound(tvSerieId);
      }

      throw error;
    }
  }
}
