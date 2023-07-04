import FilmResource from './films';
import Presenters from '../presenters';

export class MoviesFreakAPI {
  constructor(app) {
    this._app = app;
    this._database = app.getDatabase();
    this._presenters = new Presenters();
  }

  buildAPI() {
    const filmsResource = new FilmResource(this._database, this._presenters);

    this._app.registerResource(
      'films',
      filmsResource
    );
  }
}