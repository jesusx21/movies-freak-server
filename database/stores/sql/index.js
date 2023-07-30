import SQLFilmsStore from './films';
import SQLTVSeriesStore from './tvSeries';

export default class SQLDatabase {
  constructor(connection) {
    this.connection = connection;

    this.films = new SQLFilmsStore(this.connection);
    this.tvSeries = new SQLTVSeriesStore(this.connection);
  }
}
