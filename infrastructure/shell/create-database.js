const shell = require('shelljs');

const config = require('../config');

const DATABASE_NAME = config.database.name;
const ENVIRONMENT = process.env.NODE_ENV;

function createDatabase() {
  if (!ENVIRONMENT) {
    console.log('Make sure you execute yarn task with an environment: NODE_ENV=<environment> yarn run db:create');
    return process.exit(1);
  }

  if (!DATABASE_NAME) {
    console.log('Make sure you set a value for environment variable DATABASE_NAME on env file');
    return process.exit(1);
  }

  shell.exec(`createdb ${DATABASE_NAME}`, (code) => {
    if (code === 0) {
      console.log(`Database "${DATABASE_NAME}" created`);
    } else {
      console.log(`Error creating database: "${DATABASE_NAME}":`)
    }

    process.exit(0);
  });
}

createDatabase();