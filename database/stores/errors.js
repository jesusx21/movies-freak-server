import VError from 'verror';

export class DatabaseError extends VError {
  get name() {
    return this.constructor.name;
  }
}

export class NotFound extends DatabaseError {
  constructor(query) {
    super(...arguments);

    this.query = query;
    this.message = 'Record not found on database';
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
