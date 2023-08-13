import SQLFilmsStore from './films';
import SQLTVSeason from './tvSeason';
import SQLTVSeriesStore from './tvSeries';

export default class SQLDatabase {
  constructor(connection) {
    this.connection = connection;

    this.films = new SQLFilmsStore(this.connection);
    this.tvSeasons = new SQLTVSeason(this.connection);
    this.tvSeries = new SQLTVSeriesStore(this.connection);
  }
}
