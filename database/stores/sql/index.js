import SQLFilmsStore from './films';
import SQLTVEpisodeStore from './tvEpisodes';
import SQLTVSeason from './tvSeason';
import SQLTVSeriesStore from './tvSeries';

export default class SQLDatabase {
  constructor(connection) {
    this.connection = connection;

    this.films = new SQLFilmsStore(this.connection);
    this.tvEpisodes = new SQLTVEpisodeStore(this.connection);
    this.tvSeasons = new SQLTVSeason(this.connection);
    this.tvSeries = new SQLTVSeriesStore(this.connection);
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
