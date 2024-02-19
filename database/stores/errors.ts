import { DatabaseErrorParams } from '../../types/database';
import { Json } from '../../types/common';


export class DatabaseError extends Error {
  readonly cause?: Json;
  readonly info?: Json;

  constructor(args: DatabaseErrorParams = {}) {
    super(args.message || 'Something unexpected happened');

    this.name = args.name || this.constructor.name;
    this.cause = args.error;
    this.info = args.info || {};
  }
}

export class NotFound extends DatabaseError {
  readonly query: {};

  constructor(query: {}) {
    super({
      message: 'Record not found on database',
      info: { query }
    });

    this.query = query;
  }
}

export class FilmNotFound extends NotFound {}
export class SessionNotFound extends NotFound {}
export class TVEpisodeNotFound extends NotFound {}
export class TVSerieNotFound extends NotFound {}
export class TVSeasonNotFound extends NotFound {}
export class UserNotFound extends NotFound {}

export class EmailAlreadyExists extends DatabaseError {}
export class UsernameAlreadyExists extends DatabaseError {}

export class IMDBIdAlreadyExists extends  DatabaseError {
  constructor(imdbId?: string) {
    const info = imdbId ? { imdbId } : {};

    super({ info });
  }
}
