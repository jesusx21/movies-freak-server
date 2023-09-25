import FilmsResource from './films';
import TVSeriesResource from './tvSeries';
import FilmResource from './film';
import TVSerieResource from './tvSerie';
import Register from './register';

export class MoviesFreakAPI {
  constructor(app) {
    this._app = app;
  }

  buildAPI() {
    const filmResource = new FilmResource();
    const filmsResource = new FilmsResource();
    const tvSerieResource = new TVSerieResource();
    const tvSeriesResource = new TVSeriesResource();

    const register = new Register();

    this._app.registerResource('films', filmsResource);
    this._app.registerResource('films/:filmId', filmResource);
    this._app.registerResource('tv-series', tvSeriesResource);
    this._app.registerResource('tv-series/:tvSerieId', tvSerieResource);
    this._app.registerResource('sign-up', register);
  }
}
