// Update with your config settings.
import { Environment } from './types/common';
const knexConfig = {
    [Environment.TEST]: {
        client: 'postgres',
        connection: {
            database: 'movies_freak_test',
            user: 'postgres',
            password: 'postgres'
        }
    },
    [Environment.DEVELOPMENT]: {
        client: 'postgres',
        connection: {
            database: 'movies_freak_dev',
            user: 'postgres'
        }
    },
    [Environment.STAGING]: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    },
    [Environment.PRODUCTION]: {
        client: 'postgresql',
        connection: {
            database: 'my_db',
            user: 'username',
            password: 'password'
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
export default knexConfig;
//# sourceMappingURL=knexfile.js.map