import Crypto from 'crypto';
import { isEmpty } from 'lodash';

import Entity from './entity';
import { Password } from '../../../types/entities';
import { ReadOnlyField, UserHasNotPassword } from './errors';
import { Json } from '../../../types/common';

class User extends Entity {
  private _password: Password;
  name: string;
  username: string;
  lastName?: string;
  email: string; // email
  birthdate?: Date;

  constructor(args: Json) {
    super(args.id, args.createdAt, args.updatedAt);

    this.name = args.name;
    this.username = args.username;
    this.lastName = args.lastName;
    this.email = args.email;
    this.birthdate = args.birthdate;

    this._password = {};
  }

  get password() {
    return this._password;
  }

  set password(password: Password) {
    if (!isEmpty(this._password)) {
      throw new ReadOnlyField('password')
    }

    this._password = password;
  }

  addPassword(password: string) {
    const salt = this.generateSalt();
    const hash = this.hashPassword(salt, password);

    this._password = { salt, hash };
  }

  doesPasswordMatch(password: string) {
    if (!this._password.salt) {
      throw new UserHasNotPassword();
    }

    const passwordHash = this.hashPassword(this._password.salt, password);

    return this._password.hash === passwordHash;
  }

  private generateSalt() {
    return Crypto.randomBytes(8)
      .toString('hex');
  }

  private hashPassword(salt: string, password: string) {
    const hash = Crypto.createHmac('sha512', salt);

    hash.update(password);
    return hash.digest('hex');
  }
}

export default User;
