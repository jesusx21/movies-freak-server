interface MoviesFreakErrorParams {
  error?: Error;
  name?: string;
  message?: string;
  info?: {};
}

export class MoviesFreakError extends Error {
  readonly cause?: Error;
  readonly info?: {};

  constructor(args: MoviesFreakErrorParams = {}) {
    super(args.message || 'Something unexpected happened');

    this.name = args.name || this.constructor.name;
    this.cause = args.error;
    this.info = args.info || {};
  }
}

export class CouldNotCreateFilm extends MoviesFreakError {
  constructor(error: Error, info = {}) {
    super({
      error,
      info,
      message: 'Could not create a film succesfully'
    });
  }
}

export class CouldNotCreateTVSerie extends MoviesFreakError {
  constructor(error: Error, info = {}) {
    super({
      error,
      info,
      message: 'Could not create a tv serie succesfully'
    });
  }
}

export class CouldNotCreateTVSeasons extends CouldNotCreateTVSerie {}
export class CouldNotCreateTVEpisodes extends CouldNotCreateTVSeasons {}

export class CouldNotCreateWatchlist extends MoviesFreakError {}
export class CouldNotSignUp extends MoviesFreakError {}
export class CouldNotSignIn extends MoviesFreakError {}

export class EmailAlreadyUsed extends MoviesFreakError {}
export class UsernameAlreadyUsed extends MoviesFreakError {}

export class InvalidType extends MoviesFreakError {}
export class UserNotFound extends MoviesFreakError {}
export class InvalidPassword extends MoviesFreakError {}
