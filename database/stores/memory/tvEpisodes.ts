import Store from './store';
import { NotFound, TVEpisodeNotFound } from '../errors';
import { QueryOptions } from '../interfaces';
import { TVEpisode } from '../../../app/moviesFreak/entities';
import { UUID } from '../../../typescript/customTypes';

class InMemoryTVEpisodesStore {
  private store: Store<TVEpisode>;

  constructor() {
    this.store = new Store<TVEpisode>();
  }

  create(tvEpisode: TVEpisode) {
    return this.store.create(tvEpisode);
  }

  async findById(tvEpisodeId: UUID) {
    try {
      return await this.store.findById(tvEpisodeId);
    } catch (error) {
      if (error instanceof NotFound) {
        throw new TVEpisodeNotFound(tvEpisodeId);
      }

      throw error;
    }
  }

  async findByTVSeasonId(tvSeasonId: UUID, options: QueryOptions = {}) {
    options.query = { tvSeasonId };

    return this.store.find(options);
  }

  async countByTVSeasonId(tvSeasonId: UUID) {
    return this.store.count({ tvSeasonId });
  }
}

export default InMemoryTVEpisodesStore
