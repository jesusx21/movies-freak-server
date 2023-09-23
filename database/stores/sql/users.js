import { omit } from 'lodash';

import { UserSerializer } from './serializers';
import { SQLDatabaseException } from './errors';
import {
  EmailAlreadyExists,
  UserNotFound,
  UsernameAlreadyExists
} from '../errors';

export default class SQLUsersStore {
  constructor(connection) {
    this._connection = connection;
  }

  async create(user) {
    const dataToInsert = this._serialize(user);

    let result;

    try {
      [result] = await this._connection('users')
        .returning('*')
        .insert(dataToInsert);
    } catch (error) {
      if (error.constraint === 'users_email_unique') {
        throw new EmailAlreadyExists();
      }
      if (error.constraint === 'users_username_unique') {
        throw new UsernameAlreadyExists();
      }

      throw new SQLDatabaseException(error);
    }

    return this._deserialize(result);
  }

  async findById(userId) {
    let result;

    try {
      result = await this._connection('users')
        .where('id', userId)
        .first();
    } catch (error) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new UserNotFound(userId);
    }

    return this._deserialize(result);
  }

  _serialize(user) {
    const result = UserSerializer.toJSON(user);

    result.password_hash = user._password.hash;
    result.password_salt = user._password.salt;

    return omit(result, ['id', 'created_at', 'updated_at']);
  }

  _deserialize(data) {
    const user = UserSerializer.fromJSON(data);

    user._password = {
      hash: data.password_hash,
      salt: data.password_salt
    };

    return user;
  }
}
