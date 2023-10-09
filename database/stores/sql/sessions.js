import { pick } from 'lodash';

import { SessionSerializer } from './serializers';
import { SQLDatabaseException } from './errors';
import { SessionNotFound } from '../errors';

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

  findActiveByUserId(userId) {
    return this._findOne({
      is_active: true,
      user_id: userId
    });
  }

  async update(session) {
    const data = this._serialize(session);

    let result;

    try {
      [result] = await this._connection('sessions')
        .returning('*')
        .where('id', session.id)
        .update({
          ...pick(data, ['token', 'expires_at', 'is_active']),
          updated_at: new Date()
        });
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new SessionNotFound(session.id);
    }

    return this._deserialize(result);
  }

  async _findOne(query) {
    let result;

    try {
      result = await this._connection('sessions')
        .where(query)
        .orderBy('created_at', 'desc')
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new SessionNotFound(query);
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
