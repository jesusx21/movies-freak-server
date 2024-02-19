import Crypto from 'crypto';

import Entity from './entity';
import User from './user';
import { ReadOnlyField, SessionAlreadyActive } from './errors';
import SessionEntity from '../../../types/entities/session';

class Session extends Entity {
  private _user?: User;
  private _expiresAt?: Date | null;
  private _isActive?: boolean;
  private _token?: string;

  constructor(args: SessionEntity) {
    super(args.id, args.createdAt, args.updatedAt);

    this._user = args.user;
    this._token = args.token;
    this._expiresAt = args.expiresAt;
    this._isActive = args.isActive || false;
  }

  get token(): string | undefined {
    return this._token;
  }

  get expiresAt() {
    return this._expiresAt;
  }

  get user(): User | undefined {
    return this._user;
  }

  set user(user: User) {
    if (this._user) {
      throw new ReadOnlyField('user');
    }

    this._user = user;
  }

  isActive() {
    return this._isActive;
  }

  generateToken() {
    this._token = Crypto.randomBytes(32)
      .toString('hex');

    this._expiresAt =  null;
    this._isActive = false;

    return this;
  }

  activateToken() {
    if (this.isActive()) {
      throw new SessionAlreadyActive();
    }

    this._expiresAt = new Date();
    const day = this._expiresAt.getDate();

    this._expiresAt.setDate(day + 2);
    this._isActive = true;

    return this;
  }

  isExpired() {
    if (!this._expiresAt) {
      return true;
    }

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

export default Session;
