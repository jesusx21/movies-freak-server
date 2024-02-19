import { Knex } from 'knex';
import { omit } from 'lodash';

import { SQLDatabaseException } from './errors';
import { User } from '../../../app/moviesFreak/entities';
import { UserSerializer } from './serializers';
import { UUID } from '../../../types/common';
import {
  EmailAlreadyExists,
  UsernameAlreadyExists,
  UserNotFound
} from '../errors';

interface userRecord {
  password_hash?: string;
  password_salt?: string;
}

class SQLUsersStore {
  private connection: Knex;

  constructor(connection: Knex) {
    this.connection = connection;
  }

  async create(user: User) {
    const dataToInsert = this.serialize(user);

    let result: userRecord;

    try {
      [result] = await this.connection('users')
        .returning('*')
        .insert(dataToInsert);
    } catch (error: any) {
      if (error.constraint === 'users_email_unique') {
        throw new EmailAlreadyExists();
      }
      if (error.constraint === 'users_username_unique') {
        throw new UsernameAlreadyExists();
      }

      throw new SQLDatabaseException(error);
    }

    return this.deserialize(result);
  }

  async findById(userId: UUID) {
    return this.findOne({ id: userId });
  }

  async findByEmail(email: string) {
    return this.findOne({ email });
  }

  async findByUsername(username: string) {
    return this.findOne({ username });
  }

  private async findOne(query: {}) {
    let result: userRecord;

    try {
      result = await this.connection('users')
        .where(query)
        .first();
    } catch (error: any) {
      throw new SQLDatabaseException(error);
    }

    if (!result) {
      throw new UserNotFound(query);
    }

    return this.deserialize(result);
  }

  private serialize(user: User): {} {
    const result = UserSerializer.toJSON(user);

    return {
      ...omit(result, ['id', 'created_at', 'updated_at']),
      password_hash: user.password.hash,
      password_salt: user.password.salt
    };
  }

  private deserialize(data: userRecord) {
    const user = UserSerializer.fromJSON(data);

    user.password = {
      hash: data.password_hash,
      salt: data.password_salt
    };

    return user;
  }
}

export default SQLUsersStore;
