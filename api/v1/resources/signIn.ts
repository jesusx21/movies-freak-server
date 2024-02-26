import { Monopoly  } from '../../../boardGame';
import { HTTPStatusCode, Request, SingleResponse } from '../../../boardGame/types';

import Login from '../../../app/moviesFreak/signIn';
import { InvalidPassword, UserNotFound } from '../../../app/moviesFreak/errors';
import { Session } from '../../../app/moviesFreak/entities';
import {
  HTTPConflict,
  HTTPInternalError,
  HTTPNotFound
} from '../../httpResponses';

class SignIn extends Monopoly {
  async onPost({ body }: Request): Promise<SingleResponse> {
    const database = this.getDependency('database');
    const login = new Login(database, body.username, body.password);

    let session: Session;

    try {
      session = await login.execute();
    } catch (error: any) {
      if (error instanceof UserNotFound) {
        throw new HTTPNotFound('USER_NOT_FOUND');
      }

      if (error instanceof InvalidPassword) {
        throw new HTTPConflict('PASSWORD_DOES_NOT_MATCH');
      }

      throw new HTTPInternalError(error);
    }

    const presenter = this.getDependency('presenters');

    return {
      status: HTTPStatusCode.OK,
      data: presenter.presentSession(session)
    };
  }
}

export default SignIn;
