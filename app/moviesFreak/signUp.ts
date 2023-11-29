import { omit } from 'lodash';

import { Database } from '../../database';
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

export interface UserData {
  name: string;
  username: string;
  lastName: string;
  password: string;
  email: string;
  birthdate: Date;
}

class SignUp {
  database: Database;
  userData: UserData;

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

export default SignUp;
