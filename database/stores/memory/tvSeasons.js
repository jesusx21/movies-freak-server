import cloneDeep from 'clone-deep';

import { NotFound, TVSeasonNotFound } from '../errors';
import Store from './store';

export default class InMemoryTVSeasonStore {
  constructor() {
    this._store = new Store();
  }

  create(tvSeason) {
    return this._store.create(tvSeason);
  }

  async findById(tvSeasonId) {
    try {
      return await this._store.findById(tvSeasonId);
    } catch (error) {
      if (error instanceof NotFound) {
        throw new TVSeasonNotFound(tvSeasonId);
      }

      throw error;
    }
  }

  async findByTVSerieId(tvSerieId, options = {}) {
    const items = Object.values(this._items)
      .filter((tvSeason) => tvSeason.tvSerieId === tvSerieId);

    const skip = options.skip || 0;
    const limit = skip + (options.limit || items.length - 1);

    return {
      items: cloneDeep(items.slice(skip, limit)),
      totalItems: await this.countByTVSerieId()
    };
  }

  async countByTVSerieId(tvSerieId) {
    return Object.values(this._items)
      .filter((tvSeason) => tvSeason.tvSerieId === tvSerieId)
      .length;
  }
}
