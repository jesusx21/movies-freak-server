import { IMDBError } from '../../errors';

export class OMDBError extends IMDBError {
  constructor(cause) {
    super();

    this.cause = cause;
  }
}
