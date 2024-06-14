import { DatabaseError } from '../errors';
export class SQLDatabaseException extends DatabaseError {
    constructor(error) {
        super({ error });
    }
}
//# sourceMappingURL=errors.js.map