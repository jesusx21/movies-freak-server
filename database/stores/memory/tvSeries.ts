import Store from './store';
import { NotFound, TVSerieNotFound } from '../errors';
import { TVSerie } from '../../../app/moviesFreak/entities';
import { UUID } from '../../../types/common';

class InMemoryTVSeriesStore {
  private store: Store<TVSerie>;

  constructor() {
    this.store = new Store<TVSerie>();
  }

  create(tvSerie: TVSerie) {
    return this.store.create(tvSerie);
  }

  async findById(tvSerieId: UUID) {
    try {
      return await this.store.findById(tvSerieId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new TVSerieNotFound(tvSerieId);
      }

      throw error;
    }
  }

  find(options = {}) {
    return this.store.find(options);
  }
}

export default InMemoryTVSeriesStore;
