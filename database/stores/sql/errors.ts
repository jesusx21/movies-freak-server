import { DatabaseError } from '../errors';
import { Json } from '../../../types/common';

export class SQLDatabaseException extends DatabaseError {
  constructor(error: Json) {
    super({ error });
  }
}
