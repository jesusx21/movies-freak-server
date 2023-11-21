import Crypto from 'crypto';
import { isEmpty } from 'lodash';

import Entity from './entity';
import { UUID } from '../../../typescript/customTypes';
import { ReadOnlyField } from './errors';

export interface PasswordHashed {
  hash?: string;
  salt?: string;
}

export interface UserParams {
  id: UUID;
  name: string;
  username: string;
  lastName: string;
  email: string; // email
  birthdate: Date;
  createdAt: Date;
  updatedAt: Date;
}

class User extends Entity {
  private _password: PasswordHashed
  name: string;
  username: string;
  lastName: string;
  email: string; // email
  birthdate: Date;

  constructor(args: UserParams) {
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

  set password(password: PasswordHashed) {
    if (isEmpty(this._password)) {
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
    const passwordHash = this.hashPassword(this._password.salt, password);

    return this._password.hash === passwordHash;
  }

  private generateSalt() {
    return Crypto.randomBytes(8)
      .toString('hex');
  }

  private hashPassword(salt, password) {
    const hash = Crypto.createHmac('sha512', salt);

    hash.update(password);
    return hash.digest('hex');
  }
}

export default User;
