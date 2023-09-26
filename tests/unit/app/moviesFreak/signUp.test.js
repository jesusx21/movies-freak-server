import TestCase from '../../../testHelper';

import SignUp from '../../../../app/moviesFreak/signUp';
import { Session, User } from '../../../../app/moviesFreak/entities';
import {
  CouldNotSignUp,
  EmailAlreadyUsed,
  UsernameAlreadyUsed
} from '../../../../app/moviesFreak/errors';
import { DatabaseError } from '../../../../database/stores/errors';

export class SignUpTest extends TestCase {
  setUp() {
    super.setUp();

    this._database = this.getDatabase();
    this.userData = {
      name: 'Edward',
      lastName: 'Cullen',
      username: 'eddy',
      email: 'eddy@yahoo.com',
      password: 'Password1',
      birthdate: new Date('1895-12-31')
    };

    this.useCase = new SignUp(this._database, this.userData);
  }

  async testSignUpUser() {
    const session = await this.useCase.execute();

    this.assertThat(session).isInstanceOf(Session);
    this.assertThat(session.token).doesExist();
    this.assertThat(session.expiresAt).isGreaterThan(new Date());
    this.assertThat(session.isActive).isTrue();

    this.assertThat(session.user).isInstanceOf(User);
    this.assertThat(session.user.name).isEqual('Edward');
    this.assertThat(session.user.lastName).isEqual('Cullen');
    this.assertThat(session.user.username).isEqual('eddy');
    this.assertThat(session.user.email).isEqual('eddy@yahoo.com');
    this.assertThat(session.user.birthdate).isEqual(this.userData.birthdate);
  }

  async testThrowErrorOnEmailAlreadyUsed() {
    await this.useCase.execute();
    this.userData.username = 'edward';

    const useCase = new SignUp(this._database, this.userData);

    await this.assertThat(
      useCase.execute()
    ).willBeRejectedWith(EmailAlreadyUsed);
  }

  async testThrowErrorOnUsernameAlreadyUsed() {
    await this.useCase.execute();
    this.userData.email = 'edddy@hotmail.com';

    const useCase = new SignUp(this._database, this.userData);

    await this.assertThat(
      useCase.execute()
    ).willBeRejectedWith(UsernameAlreadyUsed);
  }

  async testThrowErrorWhenSavingUser() {
    this.stubFunction(this._database.users, 'create')
      .throws(new DatabaseError());

    await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotSignUp);
  }

  async testThrowErrorWhenCreateSession() {
    this.stubFunction(this._database.sessions, 'create')
      .throws(new DatabaseError());

    await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotSignUp);
  }
}
