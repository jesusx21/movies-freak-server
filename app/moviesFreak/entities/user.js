import Crypto from 'crypto';

import Entity from './entity';

export default class User extends Entity {
  constructor({
    id,
    name,
    username,
    lastName,
    email,
    birthdate,
    createdAt,
    updatedAt
  }) {
    super(id, createdAt, updatedAt);

    this.name = name;
    this.username = username;
    this.lastName = lastName;
    this.email = email;
    this.birthdate = birthdate;

    this._password = {};
  }

  addPassword(password) {
    const salt = this._generateSalt();
    const hash = this._hashPassword(salt, password);

    this._password = { salt, hash };
  }

  doesPasswordMatch(password) {
    const passwordHash = this._hashPassword(this._password.salt, password);

    return this._password.hash === passwordHash;
  }

  _generateSalt() {
    return Crypto.randomBytes(8)
      .toString('hex');
  }

  _hashPassword(salt, password) {
    const hash = Crypto.createHmac('sha512', salt);

    hash.update(password);
    return hash.digest('hex');
  }
}
