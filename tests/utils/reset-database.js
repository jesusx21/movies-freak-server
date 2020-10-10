const ROOT_PATH = require('app-root-path');
const knexCleaner = require('knex-cleaner');
const VError = require('verror');

const { postgres } = require(`${ROOT_PATH}/src/infrastructure/database/drivers`);

const IGNORE_TABLES = [
  'knex_migrations', 'knex_migrations_lock', 'knex_migrations_id_seq'
]

function resetDatabase() {
  return knexCleaner.clean(postgres, { ignoreTables: IGNORE_TABLES, mode: 'delete' })
    .catch((error) => Promise.reject(new CantResetDatabase(error)));
}

class CantResetDatabase extends VError {
  constructor(cause) {
    super(cause);
    this.name = 'CANT_RESET_DATABASE';
    this.message = `failed to reset the database: ${cause.message}`;
    Error.captureStackTrace(this, this.constructor);
  }
};

module.exports = resetDatabase;
