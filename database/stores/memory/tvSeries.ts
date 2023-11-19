import Store from './store';
import { NotFound, TVSerieNotFound } from '../errors';
import { TVSerie } from '../../../app/moviesFreak/entities';
import { UUID } from '../../../typescript/customTypes';

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
    } catch (error) {
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
