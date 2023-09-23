import InMemoryFilmsStore from './films';
import InMemoryTVEpisodesStore from './tvEpisodes';
import InMemoryTVSeasonStore from './tvSeasons';
import InMemoryTVSeriesStore from './tvSeries';
import InMemoryUsersStore from './users';
import InMemoryWatchlistStore from './watchlist';

export default class InMemoryDatabase {
  constructor() {
    this.films = new InMemoryFilmsStore();
    this.tvEpisodes = new InMemoryTVEpisodesStore();
    this.tvSeasons = new InMemoryTVSeasonStore();
    this.tvSeries = new InMemoryTVSeriesStore();
    this.users = new InMemoryUsersStore();
    this.watchlist = new InMemoryWatchlistStore();
  }

  async withTransaction(fn, ...args) {
    return fn(this, ...args);
  }
}
