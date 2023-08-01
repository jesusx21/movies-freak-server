import FilmsResource from './films';
import TVSeriesResource from './tvSeries';
import Presenters from '../presenters';

export class MoviesFreakAPI {
  constructor(app) {
    this._app = app;
    this._database = app.getDatabase();
    this._imdb = app.getIMDBAccess();
    this._presenters = new Presenters();
  }

  buildAPI() {
    const filmsResource = new FilmsResource(this._database, this._imdb, this._presenters);
    const tvSeriesResource = new TVSeriesResource(this._database, this._imdb, this._presenters);

    this._app.registerResource('films', filmsResource);
    this._app.registerResource('tv-series', tvSeriesResource);
  }
}
