import Store from './store';
import { NotFound, TVSeasonNotFound } from '../errors';
import { TVSeason } from '../../../app/moviesFreak/entities';
import { UUID } from '../../../types/common';
import { QueryOptions } from '../../../types/database';

class InMemoryTVSeasonStore {
  private store: Store<TVSeason>;

  constructor() {
    this.store = new Store<TVSeason>();
  }

  create(tvSeason: TVSeason) {
    return this.store.create(tvSeason);
  }

  async findById(tvSeasonId: UUID) {
    try {
      return await this.store.findById(tvSeasonId);
    } catch (error: any) {
      if (error instanceof NotFound) {
        throw new TVSeasonNotFound(tvSeasonId);
      }

      throw error;
    }
  }

  async findByTVSerieId(tvSerieId: UUID, options: QueryOptions = {}) {
   options.query = { tvSerieId };

   return this.store.find(options);
  }

  async countByTVSerieId(tvSerieId: UUID) {
    return this.store.count({ tvSerieId });
  }
}

export default InMemoryTVSeasonStore;
