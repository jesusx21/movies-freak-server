import InMemoryFilmsStore from './films';
import InMemoryTVSeriesStore from './tvSeries';

export default class InMemoryDatabase {
  constructor() {
    this.films = new InMemoryFilmsStore();
    this.tvSeries = new InMemoryTVSeriesStore();
  }
}
