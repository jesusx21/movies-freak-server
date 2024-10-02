import MemoryFilmsStore from './movies';

export default class MemoryDatabase {
  readonly films: MemoryFilmsStore;

  constructor() {
    this.films = new MemoryFilmsStore();
  }
}
