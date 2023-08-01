import MoviesFreakApp from '../../api';
import imdbFactory from '../../app/imdb/factory';

export default function buildTestApp(database) {
  const imdbGateway = imdbFactory('dummy');
  const moviesFreakApp = new MoviesFreakApp(database, imdbGateway);

  moviesFreakApp.build();

  moviesFreakApp.database = database;
  moviesFreakApp.imdb = imdbGateway;

  return moviesFreakApp;
}
