import { SessionSerializer } from './serializers';
import { SQLDatabaseException } from './errors';

export default class SQLSessionsStore {
  constructor(connection, database) {
    this._connection = connection;
    this._database = database;
  }

  async create(session) {
    const dataToInsert = this._serialize(session);

    let result;

    try {
      [result] = await this._connection('sessions')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    return this._deserialize(result);
  }

  _serialize(session) {
    const result = SessionSerializer.toJSON(session);

    result.user_id = session.user.id;

    return result;
  }

  async _deserialize(data) {
    const session = SessionSerializer.fromJSON(data);
    session.user = await this._database.users.findById(data.user_id);

    return session;
  }
}
