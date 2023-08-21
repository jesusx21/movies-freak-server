import cloneDeep from 'clone-deep';

import Store from './store';
import { NotFound, TVEpisodeNotFound } from '../errors';

export default class InMemoryTVEpisodesStore {
  constructor() {
    this._store = new Store();
  }

  create(tvEpisode) {
    return this._store.create(tvEpisode);
  }

  async findById(tvEpisodeId) {
    try {
      return await this._store.findById(tvEpisodeId);
    } catch (error) {
      if (error instanceof NotFound) {
        throw new TVEpisodeNotFound(tvEpisodeId);
      }

      throw error;
    }
  }

  async findByTVSeasonId(tvSeasonId, options = {}) {
    const items = Object.values(this._items)
      .filter((tvEpisode) => tvEpisode.tvSeasonId === tvSeasonId);

    const skip = options.skip || 0;
    const limit = skip + (options.limit || items.length - 1);

    return {
      items: cloneDeep(items.slice(skip, limit)),
      totalItems: await this.countByTVSeasonId()
    };
  }

  async countByTVSeasonId(tvSeasonId) {
    return Object.values(this._items)
      .filter((tvEpisode) => tvEpisode.tvSeasonId === tvSeasonId)
      .length;
  }
}
