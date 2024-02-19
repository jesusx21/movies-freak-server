import { MoviesFreakError } from '../errors';

export class EntityError extends MoviesFreakError {}

export class FilmAlreadySet extends EntityError {}
export class TVEpisodeAlreadySet extends EntityError {}

export class SessionAlreadyActive extends EntityError {}

export class ReadOnlyField extends EntityError {
  constructor(field: string) {
    super({
      info: { field },
      message: `Field ${field} is read-only`
    });
  }
}

export class UserHasNotPassword extends EntityError {}
