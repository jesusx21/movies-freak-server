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

export class CouldNotAddMediaWatchlist extends MoviesFreakError {}
export class CouldNotGetWatchlist extends MoviesFreakError {}
export class WatchlistNotFound extends MoviesFreakError {}
export class FilmNotFound extends MoviesFreakError {}
export class TVEpisodetNotFound extends MoviesFreakError {}
export class CouldNotGetFilm extends MoviesFreakError {}
export class CouldNotGetTVEpisode extends MoviesFreakError {}

export class InvalidMediaIndex extends MoviesFreakError {
  constructor(index: number) {
    super({ info: { index } })
  }
}

export class InvalidPassword extends MoviesFreakError {
  password: string;

  constructor(password: string) {
    super({
      message: `Password ${password} invalid`,
      info: { password }
    });

    this.password = password;
  }
}
