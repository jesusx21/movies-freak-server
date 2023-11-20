import { omit } from 'lodash';

import Database from '../../database/stores/memory';
import { Session, User } from './entities';
import {
  EmailAlreadyExists,
  UsernameAlreadyExists
} from '../../database/stores/errors';
import {
  CouldNotSignUp,
  EmailAlreadyUsed,
  UsernameAlreadyUsed
} from './errors';

interface UserData {
  name: string;
  username: string;
  lastName: string;
  password: string;
  email: string;
  birthdate: Date;
}

export default class SignUp {
  private database: Database;
  private userData: UserData;

  constructor(database: Database, userData: UserData) {
    this.database = database;
    this.userData = userData;
  }

  async execute() {
    let userCreated: User;

    try {
      const user = new User(omit(this.userData, 'password'));

      user.addPassword(this.userData.password);
      userCreated = await this.database.users.create(user);
    } catch (error) {
      if (error instanceof EmailAlreadyExists) {
        throw new EmailAlreadyUsed();
      }

      if (error instanceof UsernameAlreadyExists) {
        throw new UsernameAlreadyUsed();
      }

      throw new CouldNotSignUp(error);
    }

    const session = new Session({ user: userCreated });

    session.generateToken()
      .activateToken();

    try {
      return await this.database.sessions.create(session);
    } catch (error) {
      throw new CouldNotSignUp(error);
    }
  }
}
