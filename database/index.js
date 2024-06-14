import knex from 'knex';
import knexfile from '../knexfile';
import InMemoryDatabase from './stores/memory';
import SQLDatabase from './stores/sql';
import { DatabaseDriver } from '../types/database';
export class UnsupportedDatabaseDriver extends Error {
}
function getDatabase(driverName, environment) {
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
export default getDatabase;
//# sourceMappingURL=index.js.map