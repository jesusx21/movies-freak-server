import InMemoryFilmsStore from './films';

export default class InMemoryDatabase {
  constructor() {
    this.films = new InMemoryFilmsStore();
  }
}
