import SQLFilmsStore from './films';
import SQLTVSeriesStore from './tvSeries';

export default class SQLDatabase {
  constructor(connection) {
    this.connection = connection;
  }

  get films() {
    return new SQLFilmsStore(this.connection);
  }

  get tvSeries() {
    return new SQLTVSeriesStore(this.connection);
  }
}
