import VError from 'verror';

export class DatabaseError extends VError {}
export class NotFound extends DatabaseError {}

export class FilmNotFound extends NotFound {}
export class TVEpisodeNotFound extends NotFound {}
export class TVSerieNotFound extends NotFound {}
export class TVSeasonNotFound extends NotFound {}
export class UserNotFound extends NotFound {}

export class EmailAlreadyExists extends DatabaseError {}
export class UsernameAlreadyExists extends DatabaseError {}
