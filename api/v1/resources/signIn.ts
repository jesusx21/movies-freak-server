import { Monopoly, SingleResponse } from '../../../boardGame';

import Login from '../../../app/moviesFreak/signIn';
import { InvalidPassword, UserNotFound } from '../../../app/moviesFreak/errors';
import { Session } from '../../../app/moviesFreak/entities';
import { Titles } from '../interfaces';
import {
  HTTPConflict,
  HTTPInternalError,
  HTTPNotFound,
  OK
} from '../../httpResponses';

class SignIn extends Monopoly<Titles> {
  async onPost({ body }): Promise<SingleResponse> {
    const database = this.getTitle('database');
    const login = new Login(database, body.username, body.password);

    let session: Session;

    try {
      session = await login.execute();
    } catch (error) {
      if (error instanceof UserNotFound) {
        throw new HTTPNotFound('USER_NOT_FOUND');
      }

      if (error instanceof InvalidPassword) {
        throw new HTTPConflict('PASSWORD_DOES_NOT_MATCH');
      }

      throw new HTTPInternalError(error);
    }

    const presenter = this.getTitle('presenters');

    return {
      status: OK,
      data: presenter.presentSession(session)
    };
  }
}

export default SignIn;
