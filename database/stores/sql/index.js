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
}
