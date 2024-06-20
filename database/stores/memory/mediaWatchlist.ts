import { last } from 'lodash';

import Store from './store';
import { MediaWatchlist } from '../../../app/moviesFreak/entities';
import { UUID } from '../../../types/common';

export default class InMemoryMediaWatchlist {
  private store: Store<MediaWatchlist>

  constructor() {
    this.store = new Store<MediaWatchlist>();
  }

  create(watchlist: MediaWatchlist) {
    return this.store.create(watchlist);
  }

  async getLatestIndex(watchlistId: UUID) {
    const items = (await this.store.findAll())
      .filter((item: MediaWatchlist) => item.watchlistId === watchlistId)
      .sort((itemA: MediaWatchlist, itemB: MediaWatchlist) => itemB.index - itemA.index)

    return last(items)?.index;
  }

  async updateIndexBackwards(watchlistId: UUID, newIndex: number, oldIndex: number = 1) {
    const items = (await this.store.findAll())
      .filter((item: MediaWatchlist) => {
        return item.watchlistId === watchlistId
          && item.index >= newIndex
          && item.index < oldIndex;
      });

    await Promise.all(
      items.map((item: MediaWatchlist) => {
        item.index += 1
        return this.store.update(item);
      })
    );
  }
}
