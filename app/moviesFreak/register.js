import { Session, User } from './entities';
import {
  EmailAlreadyExists,
  UsernameAlreadyExists
} from '../../database/stores/errors';
import {
  CouldNotRegister,
  EmailAlreadyUsed,
  UsernameAlreadyUsed
} from './errors';

export default class Register {
  constructor(database, userData) {
    this._database = database;
    this._userData = userData;
  }

  async execute() {
    let userCreated;

    try {
      const user = new User(this._userData);

      userCreated = await this._database.users.create(user);
    } catch (error) {
      if (error instanceof EmailAlreadyExists) {
        throw new EmailAlreadyUsed();
      }

      if (error instanceof UsernameAlreadyExists) {
        throw new UsernameAlreadyUsed();
      }

      throw new CouldNotRegister(error);
    }

    const session = new Session({ user: userCreated });

    session.generateToken(this._userData.password)
      .activateToken();

    try {
      return await this._database.sessions.create(session);
    } catch (error) {
      throw new CouldNotRegister(error);
    }
  }
}
