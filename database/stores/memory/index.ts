import InMemoryFilmsStore from './films';
import InMemoryMediaWatchlist from './mediaWatchlist';
import InMemorySessionsStore from './session';
import InMemoryTVEpisodesStore from './tvEpisodes';
import InMemoryTVSeasonStore from './tvSeasons';
import InMemoryTVSeriesStore from './tvSeries';
import InMemoryUsersStore from './users';
import InMemoryWatchlistStore from './watchlists';

class InMemoryDatabase {
  readonly films: InMemoryFilmsStore;
  readonly mediaWatchlists: InMemoryMediaWatchlist;
  readonly sessions: InMemorySessionsStore;
  readonly tvEpisodes: InMemoryTVEpisodesStore;
  readonly tvSeasons: InMemoryTVSeasonStore;
  readonly tvSeries: InMemoryTVSeriesStore;
  readonly users: InMemoryUsersStore;
  readonly watchlists: InMemoryWatchlistStore;

  constructor() {
    this.films = new InMemoryFilmsStore();
    this.mediaWatchlists = new InMemoryMediaWatchlist();
    this.sessions = new InMemorySessionsStore();
    this.tvEpisodes = new InMemoryTVEpisodesStore();
    this.tvSeasons = new InMemoryTVSeasonStore();
    this.tvSeries = new InMemoryTVSeriesStore();
    this.users = new InMemoryUsersStore();
    this.watchlists = new InMemoryWatchlistStore();
  }

  async withTransaction(fn: Function, ...args: any[]) {
    return fn(this, ...args);
  }
}

export default InMemoryDatabase;
