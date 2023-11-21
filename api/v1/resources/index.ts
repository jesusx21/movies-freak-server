import FilmsResource from './films';
import TVSeriesResource from './tvSeries';
import FilmResource from './film';
import TVSerieResource from './tvSerie';
import SignIn from './signIn';
import SignUp from './signUp';

class MoviesFreakAPI {
  private app: any;

  constructor(app) {
    this.app = app;
  }

  buildAPI() {
    const filmResource = new FilmResource();
    const filmsResource = new FilmsResource();
    const tvSerieResource = new TVSerieResource();
    const tvSeriesResource = new TVSeriesResource();

    const signIn = new SignIn();
    const signUp = new SignUp();

    this.app.registerResource('films', filmsResource);
    this.app.registerResource('films/:filmId', filmResource);
    this.app.registerResource('tv-series', tvSeriesResource);
    this.app.registerResource('tv-series/:tvSerieId', tvSerieResource);
    this.app.registerResource('sign-in', signIn);
    this.app.registerResource('sign-up', signUp);
  }
}

export default MoviesFreakAPI;
