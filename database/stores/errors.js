import VError from 'verror';

export class DatabaseError extends VError {}
export class NotFound extends DatabaseError {}

export class FilmNotFound extends NotFound {}
export class TVSerieNotFound extends NotFound {}
