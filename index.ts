import MoviesFreakApp from './api/index2';

import getDatabase from './database';
import imdbFactory from './app/imdb/factory';
import { Environment } from './types/common';
import { DatabaseDriver } from './types/database';

let DATABASE_DRIVER: DatabaseDriver;

switch (process.env.DATABASE) {
  case 'memory':
    DATABASE_DRIVER = DatabaseDriver.MEMORY;
    break;
  case 'sql':
  default:
    DATABASE_DRIVER = DatabaseDriver.SQL;
}

let environment: Environment;

switch (process.env.NODE_ENV) {
  case 'test':
    environment = Environment.TEST;
    break;
  case 'staging':
    environment = Environment.STAGING;
    break;
  case 'production':
    environment = Environment.PRODUCTION;
    break;
  case 'development':
  default:
    environment = Environment.DEVELOPMENT;
}

const IMDB_DRIVER = process.env.IMDB_DRIVER || 'omdb';
const IMDB_HOST = process.env.IMDB_HOST || 'http://www.omdbapi.com';
const IMDB_KEY = process.env.IMDB_KEY || '37938c30';

const HOST = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT || 8000);

const database = getDatabase(DATABASE_DRIVER, environment);
const imdb = imdbFactory(IMDB_DRIVER, IMDB_HOST, IMDB_KEY);

const app = new MoviesFreakApp(database, imdb);

app.build()
  .start(HOST, PORT);
