import VError from 'verror';

export class MoviesFreakError extends VError {
  get name() {
    return this.constructor.name;
  }
}

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

export class CouldNotCreateTVSeasons extends CouldNotCreateTVSerie {}
export class CouldNotCreateTVEpisodes extends CouldNotCreateTVSeasons {}

export class CouldNotSignUp extends MoviesFreakError {}
export class EmailAlreadyUsed extends MoviesFreakError {}
export class UsernameAlreadyUsed extends MoviesFreakError {}
