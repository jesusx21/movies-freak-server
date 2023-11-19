import { IMDBError } from '../../errors';

export class OMDBError extends IMDBError {
  constructor(error: Error) {
    super({ error });
  }
}
