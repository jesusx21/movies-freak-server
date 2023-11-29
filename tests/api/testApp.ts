import imdbFactory from '../../app/imdb/factory';
import MoviesFreakApp from '../../api';
import { Database } from '../../database';

function buildTestApp(database: Database) {
  const imdbGateway = imdbFactory('dummy');
  const moviesFreakApp = new MoviesFreakApp(database, imdbGateway);

  moviesFreakApp.build();

  return moviesFreakApp;
}

export default buildTestApp;

