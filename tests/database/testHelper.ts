import knex from 'knex';
import knexCleaner from 'knex-cleaner';

import knexfile from '../../knexfile';
import SQLDatabase from '../../database/stores/sql';
import TestCase from '../testHelper';
import { Environment } from '../../types/common';

class SQLTestCase extends TestCase {
  private connection?: any;
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

    const config = knexfile[Environment.TEST];
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
