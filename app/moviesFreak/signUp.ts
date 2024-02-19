import { omit } from 'lodash';

import { Database } from '../../types/database';
import { Session, User } from './entities';
import { SignUpData } from '../../types/app';
import {
  EmailAlreadyExists,
  UsernameAlreadyExists
} from '../../database/stores/errors';
import {
  CouldNotSignUp,
  EmailAlreadyUsed,
  UsernameAlreadyUsed
} from './errors';

class SignUp {
  database: Database;
  userData: SignUpData;

  constructor(database: Database, userData: SignUpData) {
    this.database = database;
    this.userData = userData;
  }

  async execute() {
    let userCreated: User;

    try {
      const user = new User(omit(this.userData, 'password'));

      user.addPassword(this.userData.password);
      userCreated = await this.database.users.create(user);
    } catch (error: any) {
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
    } catch (error: any) {
      throw new CouldNotSignUp(error);
    }
  }
}

export default SignUp;
