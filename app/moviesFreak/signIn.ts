import { Database } from '../../types/database';
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

class SignIn {
  database: Database;
  username: string;
  password: string;

  constructor(database: Database, username: string, password: string) {
    this.database = database;
    this.username = username;
    this.password = password;
  }

  async execute() {
    let user = await this.findUserByEmail();

    if (!user) {
      user = await this.findUserByUsername();
    }

    if (!user || !user.id) {
      throw new UserNotFound();
    }

    if (!user.doesPasswordMatch(this.password)) {
      throw new InvalidPassword(this.password);
    }

    let session: Session;

    try {
      session = await this.database.sessions.findActiveByUserId(user.id);
    } catch (error: any) {
      if (!(error instanceof SessionNotFound)) {
        throw new CouldNotSignIn(error);
      }

      session = new Session({ user });
    }

    session.generateToken()
      .activateToken();

    try {
      if (session.id) {
        return await this.database.sessions.update(session);
      }

      return await this.database.sessions.create(session);
    } catch (error: any) {
      throw new CouldNotSignIn(error);
    }
  }

  // eslint-disable-next-line consistent-return
  private async findUserByEmail() {
    try {
      return await this.database.users.findByEmail(this.username);
    } catch (error: any) {
      if (!(error instanceof DatabaseUserNotFound)) {
        throw new CouldNotSignIn(error);
      }
    }
  }

  // eslint-disable-next-line consistent-return
  async findUserByUsername() {
    try {
      return await this.database.users.findByUsername(this.username);
    } catch (error: any) {
      if (!(error instanceof DatabaseUserNotFound)) {
        throw new CouldNotSignIn(error);
      }
    }
  }
}

export default SignIn;
