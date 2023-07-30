import knex from 'knex';
import knexCleaner from 'knex-cleaner';

import knexfile from '../../knexfile';

import SQLDatabase from '../../database/stores/sql';
import TestHelper from '../testHelper';

export default class DatabaseTestHelper extends TestHelper {
  async buildDatabase() {
    const connection = this._buildDatabaseConnection();
    this._database = new SQLDatabase(connection);
  }

  async cleanDatabase() {
    if (!this._databaseConnection) {
      return;
    }

    await knexCleaner.clean(this._databaseConnection);
    this._databaseConnection.destroy();

    delete this._databaseConnection;
    delete this._database;
  }

  getDatabase() {
    return this._database;
  }

  _buildDatabaseConnection() {
    if (this._databaseConnection) {
      return this._databaseConnection;
    }

    const { test: config } = knexfile;

    this._databaseConnection = knex(config);

    return this._databaseConnection;
  }
}
