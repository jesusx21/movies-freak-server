import SQLFilmsStore from './films';
import SQLMediaWatchlistsStore from './mediaWatchlist';
import SQLSessionsStore from './sessions';
import SQLTVEpisodeStore from './tvEpisodes';
import SQLTVSeasonStore from './tvSeason';
import SQLTVSeriesStore from './tvSeries';
import SQLUsersStore from './users';
import SQLWatchlistsStore from './watchlists';

export default class SQLDatabase {
  constructor(connection) {
    this.connection = connection;

    this.films = new SQLFilmsStore(this.connection);
    this.mediaWatchlists = new SQLMediaWatchlistsStore(this.connection, this);
    this.sessions = new SQLSessionsStore(this.connection, this);
    this.tvEpisodes = new SQLTVEpisodeStore(this.connection);
    this.tvSeasons = new SQLTVSeasonStore(this.connection);
    this.tvSeries = new SQLTVSeriesStore(this.connection);
    this.users = new SQLUsersStore(this.connection);
    this.watchlists = new SQLWatchlistsStore(this.connection);
  }

  async withTransaction(fn, ...args) {
    const transaction = await this._transaction();

    return fn(transaction, ...args);
  }

  async _transaction() {
    const connection = await this.connection.transaction();

    await connection.raw('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;');

    return new SQLTransactionDatabase(connection);
  }
}

class SQLTransactionDatabase extends SQLDatabase {
  async commit(response) {
    await this.connection.commit();

    return response;
  }

  async rollback(error) {
    await this.connection.rollback();

    throw error;
  }
}
