import { DatabaseError } from '../errors';

export class SQLDatabaseException extends DatabaseError {
  constructor(error: Error) {
    super({ error });
  }
}
