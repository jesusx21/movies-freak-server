import Login from '../../../app/moviesFreak/signIn';
import { Monopoly } from '../../../boardGame';
import { InvalidPassword, UserNotFound } from '../../../app/moviesFreak/errors';
import { Titles } from '../interfaces';
import {
  HTTPConflict,
  HTTPInternalError,
  HTTPNotFound,
  OK
} from '../../httpResponses';
import { SingleRespponse } from '../../../boardGame/monopoly';
import { Session } from '../../../app/moviesFreak/entities';

class SignIn extends Monopoly<Titles> {
  async onPost({ body }): Promise<SingleRespponse> {
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
