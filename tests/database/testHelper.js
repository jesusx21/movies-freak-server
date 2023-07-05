import knex from 'knex';
import knexCleaner from 'knex-cleaner';

import knexfile from '../../knexfile';

import SQLDatabase from '../../database/stores/sql';
import TestHelper from '../testHelper';

export default class DatabaseTestHelper extends TestHelper {
  async cleanDatabase() {
    if (!this._connection) {
      return;
    }

    await knexCleaner.clean(this._connection);
    this._connection.destroy();

    delete this._connection;
    delete this._database;
  }

  getDatabaseConnection() {
    if (this._connection) {
      return this._connection;
    }

    const { test: config } = knexfile;
    this._connection = knex(config);

    return this._connection;
  }

  getDatabase() {
    if (this._database) {
      return this._database;
    }

    const connection = this.getDatabaseConnection();
    this._database = new SQLDatabase(connection);

    return this._database;
  }
}
