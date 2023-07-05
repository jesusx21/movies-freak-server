import VError from 'verror';

export class MoviesFreakError extends VError {}

export class CouldNotCreateFilm extends MoviesFreakError {
  constructor(cause) {
    super();

    this.cause = cause;
  }
}

export class CouldNotCreateTVSerie extends MoviesFreakError {
  constructor(cause) {
    super();

    this.cause = cause;
  }
}
