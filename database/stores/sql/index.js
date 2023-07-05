import SQLFilmsStore from './films';

export default class SQLDatabase {
  constructor(connection) {
    this.connection = connection;
  }

  get films() {
    return new SQLFilmsStore(this.connection);
  }
}
