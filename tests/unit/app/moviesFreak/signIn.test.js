import Sinon from 'sinon';

import SignIn from '../../../../app/moviesFreak/signIn';
import TestCase from '../../../testHelper';
import { Session, User } from '../../../../app/moviesFreak/entities';
import { CouldNotSignIn, InvalidPassword, UserNotFound } from '../../../../app/moviesFreak/errors';

export class SignInTest extends TestCase {
  async setUp() {
    await super.setUp();

    this._database = this.getDatabase();
    const [userData] = await this.generateFixtures({
      type: 'user',
      recipe: [
        { username: 'jon', email: 'jon@gmail.com' }
      ]
    });
    const user = new User(userData);
    user.addPassword('Password123');

    this.user = await this._database.users.create(user);
  }

  async testSignIWithUsername() {
    const signIn = new SignIn(this._database, 'jon', 'Password123');

    const session = await signIn.execute();

    this.assertThat(session.id).doesExist();
    this.assertThat(session.token).doesExist();
    this.assertThat(session.expiresAt).isGreaterThan(new Date());
    this.assertThat(session.isActive).isTrue();
    this.assertThat(session.user).isInstanceOf(User);
    this.assertThat(session.user.id).isEqual(this.user.id);
  }

  async testSignIWithEmail() {
    const signIn = new SignIn(this._database, 'jon@gmail.com', 'Password123');

    const session = await signIn.execute();

    this.assertThat(session.id).doesExist();
    this.assertThat(session.token).doesExist();
    this.assertThat(session.expiresAt).isGreaterThan(new Date());
    this.assertThat(session.isActive).isTrue();
    this.assertThat(session.user).isInstanceOf(User);
    this.assertThat(session.user.id).isEqual(this.user.id);
  }

  async testUpdateAlreadyExistentActiveSession() {
    const signIn = new SignIn(this._database, 'jon@gmail.com', 'Password123');

    const clock = Sinon.useFakeTimers(new Date(2023, 5, 12));
    const sessionOne = await signIn.execute();

    clock.restore();
    const sessionTwo = await signIn.execute();

    this.assertThat(sessionTwo).isInstanceOf(Session);
    this.assertThat(sessionTwo.id).isEqual(sessionOne.id);
    this.assertThat(sessionTwo.token).doesExist();
    this.assertThat(sessionTwo.token).isNotEqual(sessionOne.token);
    this.assertThat(sessionTwo.expiresAt).isGreaterThan(new Date());
    this.assertThat(sessionTwo.expiresAt).isNotEqual(sessionOne.expiresAt);
    this.assertThat(sessionTwo.isActive).isTrue();
    this.assertThat(sessionTwo.user).isInstanceOf(User);
    this.assertThat(sessionTwo.user.id).isEqual(sessionOne.user.id);
  }

  async testRaiseNotFoundErrorOnNotExistentUsername() {
    const signIn = new SignIn(this._database, 'jane', 'Password123');

    return this.assertThat(
      signIn.execute()
    ).willBeRejectedWith(UserNotFound);
  }

  async testRaiseNotFoundErrorOnNotExistentEmail() {
    const signIn = new SignIn(this._database, 'jane@gmail.com', 'Password123');

    return this.assertThat(
      signIn.execute()
    ).willBeRejectedWith(UserNotFound);
  }

  async testRaiseErrorWhenPasswordDoesNotMatch() {
    const signIn = new SignIn(this._database, 'jon@gmail.com', 'Password789');

    return this.assertThat(
      signIn.execute()
    ).willBeRejectedWith(InvalidPassword);
  }

  async testThrowErrorWhenFindingUserByEmail() {
    const signIn = new SignIn(this._database, 'jon@gmail.com', 'Password789');

    this.stubFunction(signIn._database.users, 'findByEmail')
      .throws(new Error());

    await this.assertThat(
      signIn.execute()
    ).willBeRejectedWith(CouldNotSignIn);
  }

  async testThrowErrorWhenFindingUserByUsername() {
    const signIn = new SignIn(this._database, 'jon', 'Password789');

    this.stubFunction(signIn._database.users, 'findByUsername')
      .throws(new Error());

    await this.assertThat(
      signIn.execute()
    ).willBeRejectedWith(CouldNotSignIn);
  }

  async testThrowErrorWhenFindingActiveSession() {
    const signIn = new SignIn(this._database, 'jon', 'Password123');

    this.stubFunction(this._database.sessions, 'findActiveByUserId')
      .throws(new Error());

    await this.assertThat(
      signIn.execute()
    ).willBeRejectedWith(CouldNotSignIn);
  }

  async testThrowErrorWhenCreatingSession() {
    const signIn = new SignIn(this._database, 'jon', 'Password123');

    this.stubFunction(signIn._database.sessions, 'create')
      .throws(new Error());

    await this.assertThat(
      signIn.execute()
    ).willBeRejectedWith(CouldNotSignIn);
  }
}
