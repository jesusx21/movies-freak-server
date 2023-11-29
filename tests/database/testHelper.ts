import knex, { Knex } from 'knex';
import knexCleaner from 'knex-cleaner';

import knexfile from '../../knexfile';
import SQLDatabase from '../../database/stores/sql';
import TestCase from '../testHelper';

class SQLTestCase extends TestCase {
  private connection?: Knex;
  database?: SQLDatabase;

  async cleanDatabase() {
    if (!this.connection) {
      return;
    }

    await knexCleaner.clean(this.connection);
    this.connection.destroy();

    this.connection = undefined;
    this.database = undefined;
  }

  getDatabaseConnection() {
    if (this.connection) {
      return this.connection;
    }

    const { test: config } = knexfile;
    this.connection = knex(config);

    return this.connection;
  }

  getDatabase() {
    if (this.database) {
      return this.database;
    }

    const connection = this.getDatabaseConnection();
    this.database = new SQLDatabase(connection);

    return this.database;
  }
}

export default SQLTestCase;
