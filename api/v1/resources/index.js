import FilmResource from './films';
import Presenters from '../presenters';

export class MoviesFreakAPI {
  constructor(app) {
    this._app = app;
    this._database = app.getDatabase();
    this._imdb = app.getIMDBAccess();
    this._presenters = new Presenters();
  }

  buildAPI() {
    const filmsResource = new FilmResource(this._database, this._imdb, this._presenters);
    const tvSeriesResource = new FilmResource(this._database, this._imdb, this._presenters);

    this._app.registerResource('films', filmsResource);
    this._app.registerResource('tvSeries', tvSeriesResource);
  }
}
