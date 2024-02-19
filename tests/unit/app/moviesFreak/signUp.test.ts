import MoviesFreakTestCase from './testHelper';

import SignUp from '../../../../app/moviesFreak/signUp';
import { Database } from '../../../../types/database';
import { DatabaseError } from '../../../../database/stores/errors';
import { Session, User } from '../../../../app/moviesFreak/entities';
import { SignUpData } from '../../../../types/app';
import {
  CouldNotSignUp,
  EmailAlreadyUsed,
  UsernameAlreadyUsed
} from '../../../../app/moviesFreak/errors';

export class SignUpTest extends MoviesFreakTestCase {
  database: Database;

  constructor() {
    super();

    this.database = this.getDatabase();
  }

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();
  }

  async testSignUpUser() {
    const userData = this.getUserData();
    const session = await this.runUseCase(SignUp, this.database, userData);

    this.assertThat(session).isInstanceOf(Session);
    this.assertThat(session?.token).doesExist();
    this.assertThat(session?.expiresAt).isGreaterThan(new Date());
    this.assertThat(session?.isActive()).isTrue();

    this.assertThat(session?.user).isInstanceOf(User);
    this.assertThat(session?.user?.name).isEqual('Edward');
    this.assertThat(session?.user?.lastName).isEqual('Cullen');
    this.assertThat(session?.user?.username).isEqual('eddy');
    this.assertThat(session?.user?.email).isEqual('eddy@yahoo.com');
    this.assertThat(session?.user?.birthdate).isEqual(userData.birthdate);
  }

  async testThrowErrorOnEmailAlreadyUsed() {
    const database = this.database;

    await this.runUseCase(
      SignUp,
      database,
      this.getUserData()
    );

    const userData = {
      ...this.getUserData(),
      username: 'edward'
    };

    await this.assertThat(
      this.runUseCase(SignUp, database, userData)
    ).willBeRejectedWith(EmailAlreadyUsed);
  }

  async testThrowErrorOnUsernameAlreadyUsed() {
    await this.runUseCase(
      SignUp,
      this.database,
      this.getUserData()
    );

    const userData = {
      ...this.getUserData(),
      email: 'edddy@hotmail.com'
    };

    await this.assertThat(
      this.runUseCase(SignUp, this.database, userData)
    ).willBeRejectedWith(UsernameAlreadyUsed);
  }

  async testThrowErrorWhenSavingUser() {
    this.stubFunction(this.database.users, 'create')
      .throws(new DatabaseError());

    await this.assertThat(
      this.runUseCase(SignUp, this.database, this.getUserData())
    ).willBeRejectedWith(CouldNotSignUp);
  }

  async testThrowErrorWhenCreateSession() {
    this.stubFunction(this.database.sessions, 'create')
      .throws(new DatabaseError());

    await this.assertThat(
      this.runUseCase(SignUp, this.database, this.getUserData())
    ).willBeRejectedWith(CouldNotSignUp);
  }

  private getUserData(): SignUpData {
    return {
      name: 'Edward',
      lastName: 'Cullen',
      username: 'eddy',
      email: 'eddy@yahoo.com',
      password: 'Password1',
      birthdate: new Date('1895-12-31')
    };
  }
}
