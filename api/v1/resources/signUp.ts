import { Monopoly } from '../../../boardGame';
import { HTTPStatusCode, Request, SingleResponse } from '../../../boardGame/types';

import Register from '../../../app/moviesFreak/signUp';
import { HTTPConflict, HTTPInternalError } from '../../httpResponses';
import { EmailAlreadyUsed, UsernameAlreadyUsed } from '../../../app/moviesFreak/errors';
import { Session } from '../../../app/moviesFreak/entities';

interface SignUpRequest extends Request {
  body: {
    name: string;
    username: string;
    lastName: string;
    password: string;
    email: string;
    birthdate: Date;
  }
}

class SignUp extends Monopoly {
  async onPost({ body }: SignUpRequest): Promise<SingleResponse> {
    const database = this.getTitle('database');
    const signUp = new Register(database, body);

    let session: Session;

    try {
      session = await signUp.execute();
    } catch (error: any) {
      if (error instanceof EmailAlreadyUsed) {
        throw new HTTPConflict('EMAIL_ALREADY_USED');
      }

      if (error instanceof UsernameAlreadyUsed) {
        throw new HTTPConflict('USERNAME_ALREADY_USED');
      }

      throw new HTTPInternalError(error);
    }

    const presenter = this.getTitle('presenters');

    return {
      status: HTTPStatusCode.CREATED,
      data: presenter.presentSession(session)
    };
  }
}

export default SignUp;
