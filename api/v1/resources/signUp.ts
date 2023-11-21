import { Monopoly, SingleResponse } from '../../../boardGame';

import Register from '../../../app/moviesFreak/signUp';
import { CREATED, HTTPConflict, HTTPInternalError } from '../../httpResponses';
import { EmailAlreadyUsed, UsernameAlreadyUsed } from '../../../app/moviesFreak/errors';
import { Session } from '../../../app/moviesFreak/entities';
import { Titles } from '../interfaces';

class SignUp extends Monopoly<Titles> {
  async onPost({ body }): Promise<SingleResponse> {
    const database = this.getTitle('database');
    const signUp = new Register(database, body);

    let session: Session;

    try {
      session = await signUp.execute();
    } catch (error) {
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
      status: CREATED,
      data: presenter.presentSession(session)
    };
  }
}

export default SignUp;
