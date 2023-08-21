import InMemoryFilmsStore from './films';
import InMemoryTVEpisodesStore from './tvEpisodes';
import InMemoryTVSeasonStore from './tvSeasons';
import InMemoryTVSeriesStore from './tvSeries';

export default class InMemoryDatabase {
  constructor() {
    this.films = new InMemoryFilmsStore();
    this.tvEpisodes = new InMemoryTVEpisodesStore();
    this.tvSeasons = new InMemoryTVSeasonStore();
    this.tvSeries = new InMemoryTVSeriesStore();
  }
}
