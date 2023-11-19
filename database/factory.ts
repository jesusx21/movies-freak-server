import knex from 'knex';

import knexfile from '../knexfile';
import SQLDatabase from './stores/sql';
import InMemoryDatabase from './stores/memory';

export class UnsupportedDatabaseDriver extends Error {}

function getDatabase(driverName: string, environment: string) {
  if (driverName === 'sql') {
    const config = knexfile[environment];
    const connection = knex(config);

    return new SQLDatabase(connection);
  }

  if (driverName === 'memory') {
    return new InMemoryDatabase();
  }

  throw new UnsupportedDatabaseDriver(driverName);
}

export default getDatabase;
