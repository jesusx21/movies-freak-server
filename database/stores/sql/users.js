import { EmailAlreadyExists, UsernameAlreadyExists } from '../errors';
import { SQLDatabaseException } from './errors';
import { UserSerializer } from './serializers';

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

  _serialize(user) {
    const result = UserSerializer.toJSON(user);

    result.password_hash = user._password.hash;
    result.password_salt = user._password.salt;

    return result;
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
