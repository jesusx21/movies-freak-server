import { MoviesFreakError } from '../errors';

export class EntityError extends MoviesFreakError {}

export class FilmAlreadySet extends EntityError {}
export class TVEpisodeAlreadySet extends EntityError {}
