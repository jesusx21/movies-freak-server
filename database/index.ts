import knex from 'knex';

import knexfile from '../knexfile';
import InMemoryDatabase from './stores/memory';
import SQLDatabase from './stores/sql';
import { Environment } from '../types/common';
import { DatabaseDriver } from '../types/database';

export class UnsupportedDatabaseDriver extends Error {}

export default function getDatabase(driverName: DatabaseDriver, environment: Environment) {
  if (driverName === DatabaseDriver.SQL) {
    const config = knexfile[environment];
    const connection = knex(config);

    return new SQLDatabase(connection);
  }

  if (driverName === DatabaseDriver.MEMORY) {
    return new InMemoryDatabase();
  }

  throw new UnsupportedDatabaseDriver(driverName);
}
