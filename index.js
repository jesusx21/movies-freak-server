import MoviesFreakApp from './api';

import getDatabase from './database/factory';

const DATABASE_DRIVER = process.env.DATABASE || 'sql';
const ENVIRONMENT = process.env.NODE_ENV || 'development';
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8000;

const database = getDatabase(DATABASE_DRIVER, ENVIRONMENT);

const app = new MoviesFreakApp(database);

app.build()
  .start(HOST, PORT);