import Crypto from 'crypto';
import { isNil } from 'lodash';

import Entity from './entity';
import { ReadOnlyField, SessionAlreadyActive } from './errors';

export default class Session extends Entity {
  constructor({
    id,
    user,
    token,
    expiresAt,
    isActive,
    createdAt,
    updatedAt
  }) {
    super(id, createdAt, updatedAt);

    this._user = user;
    this._token = token;
    this._expiresAt = expiresAt;
    this._isActive = isActive;
  }

  get user() {
    return this._user;
  }

  set user(user) {
    if (this._user) {
      throw new ReadOnlyField('user');
    }

    this._user = user;
  }

  get token() {
    return this._token;
  }

  set token(token) {
    if (this._token) {
      throw new ReadOnlyField('token');
    }

    this._token = token;
  }

  get expiresAt() {
    return this._expiresAt;
  }

  set expiresAt(expiresAt) {
    if (this._expiresAt) {
      throw new ReadOnlyField('expiresAt');
    }

    this._expiresAt = expiresAt;
  }

  get isActive() {
    return this._isActive;
  }

  set isActive(isActive) {
    if (!isNil(this._isActive)) {
      throw new ReadOnlyField('isActive');
    }

    this._isActive = isActive;
  }

  generateToken() {
    this._token = Crypto.randomBytes(32)
      .toString('hex');

    this._expiresAt = null;
    this._isActive = false;

    return this;
  }

  activateToken() {
    if (this._isActive) {
      throw new SessionAlreadyActive();
    }

    this._expiresAt = new Date();
    const day = this._expiresAt.getDate();

    this._expiresAt.setDate(day + 2);
    this._isActive = true;

    return this;
  }

  isExpired() {
    return this._expiresAt < new Date();
  }

  reactivateToken() {
    this._isActive = false;

    return this.activateToken();
  }

  deactivateToken() {
    if (!this.isExpired()) {
      this._expiresAt = new Date();
    }

    this._isActive = false;

    return this;
  }
}
