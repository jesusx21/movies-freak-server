import { Session } from './entities';
import {
  CouldNotSignIn,
  InvalidPassword,
  UserNotFound
} from './errors';
import {
  UserNotFound as DatabaseUserNotFound,
  SessionNotFound
} from '../../database/stores/errors';

export default class SignIn {
  constructor(database, username, password) {
    this._database = database;
    this._username = username;
    this._password = password;
  }

  async execute() {
    let user = await this._findUserByEmail();

    if (!user) {
      user = await this._findUserByUsername();
    }

    if (!user) {
      throw new UserNotFound();
    }

    if (!user.doesPasswordMatch(this._password)) {
      throw new InvalidPassword(this._password);
    }

    let session;

    try {
      session = await this._database.sessions.findActiveByUserId(user.id);
    } catch (error) {
      if (!(error instanceof SessionNotFound)) {
        throw new CouldNotSignIn(error);
      }

      session = new Session({ user });
    }

    session.generateToken()
      .activateToken();

    try {
      if (session.id) {
        return await this._database.sessions.update(session);
      }

      return await this._database.sessions.create(session);
    } catch (error) {
      throw new CouldNotSignIn(error);
    }
  }

  // eslint-disable-next-line consistent-return
  async _findUserByEmail() {
    try {
      return await this._database.users.findByEmail(this._username);
    } catch (error) {
      if (!(error instanceof DatabaseUserNotFound)) {
        throw new CouldNotSignIn(error);
      }
    }
  }

  // eslint-disable-next-line consistent-return
  async _findUserByUsername() {
    try {
      return await this._database.users.findByUsername(this._username);
    } catch (error) {
      if (!(error instanceof DatabaseUserNotFound)) {
        throw new CouldNotSignIn(error);
      }
    }
  }
}
