import MoviesFreakApp from './api';

import getDatabase from './database';
import imdbFactory from './app/imdb/factory';

const DATABASE_DRIVER = process.env.DATABASE || 'sql';
const ENVIRONMENT = process.env.NODE_ENV || 'development';

const IMDB_DRIVER = process.env.IMDB_DRIVER || 'omdb';
const IMDB_HOST = process.env.IMDB_HOST || 'http://www.omdbapi.com';
const IMDB_KEY = process.env.IMDB_KEY || '37938c30';

const HOST = process.env.HOST || 'localhost';
const PORT = Number(process.env.PORT || 8000);

const database = getDatabase(DATABASE_DRIVER, ENVIRONMENT);
const imdb = imdbFactory(IMDB_DRIVER, IMDB_HOST, IMDB_KEY);

const app = new MoviesFreakApp(database, imdb);

app.build()
  .start(HOST, PORT);
