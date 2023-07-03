import VError from 'verror';

export class DatabaseError extends VError {}
class NotFound extends DatabaseError {}

export class FilmNotFound extends NotFound {}