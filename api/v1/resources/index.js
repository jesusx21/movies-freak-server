import FilmsResource from './films';
import TVSeriesResource from './tvSeries';

export class MoviesFreakAPI {
  constructor(app) {
    this._app = app;
  }

  buildAPI() {
    const filmsResource = new FilmsResource();
    const tvSeriesResource = new TVSeriesResource();

    this._app.registerResource('films', filmsResource);
    this._app.registerResource('tv-series', tvSeriesResource);
  }
}
