import TestCase from '../../../../testHelper';

import { Session, User } from '../../../../../app/moviesFreak/entities';
import {
  ReadOnlyField,
  SessionAlreadyActive
} from '../../../../../app/moviesFreak/entities/errors';

export class SessionTest extends TestCase {
  testCreateWithUser() {
    const user = this.getUser();
    const session = new Session({ user });

    this.assertThat(session.user).isEqual(user);
  }

  testThrowsErrorOnUserAlreadySet() {
    const user = this.getUser();
    const session = new Session({ user });

    this.assertThat(
      () => session.user = user
    ).willThrow(ReadOnlyField);
  }

  testGenerateToken() {
    const session = this.buildSession(this.getUser())
      .generateToken();

    this.assertThat(session.token).doesExist();
    this.assertThat(session.token).isNotEqual('fake-token');
    this.assertThat(session.expiresAt).isNull();
    this.assertThat(session.isActive()).isFalse();
  }

  testActivateToken() {
    const session = this.buildSession(this.getUser())
      .generateToken()
      .activateToken();

    this.assertThat(session.token).isNotEqual('fake-token');
    this.assertThat(session.expiresAt).isGreaterThan(new Date());
    this.assertThat(session.isActive()).isTrue();
  }

  testThrowsErrorTokenAlreadyActived() {
    const session = this.buildSession(this.getUser())
      .generateToken()
      .activateToken();

    this.assertThat(
      () => session.activateToken()
    ).willThrow(SessionAlreadyActive);
  }

  testReturnTrueWhenIsExpired() {
    this.mockDate(2023, 1, 1);

    const session = this.buildSession(this.getUser())
      .generateToken()
      .activateToken();

    this.restoreSandbox();

    this.assertThat(session.isExpired()).isTrue();
  }

  testReturnFalseWhenIsNotExpired() {
    const session = this.buildSession(this.getUser())
      .generateToken()
      .activateToken();

    this.assertThat(session.isExpired()).isFalse();
  }

  testReactivateToken() {
    const session = this.buildSession(this.getUser())
      .generateToken()
      .reactivateToken();

    this.assertThat(session.token).isNotEqual('fake-token');
    this.assertThat(session.expiresAt).isGreaterThan(new Date());
    this.assertThat(session.isActive()).isTrue();
  }

  testDeactivateToken() {
    const session = this.buildSession(this.getUser())
      .generateToken()
      .activateToken()
      .deactivateToken();

    this.assertThat(session.expiresAt).isLessThanOrEqual(new Date());
    this.assertThat(session.isActive()).isFalse();
  }

  private getUser() {
    return new User({
      name: 'Charles',
      lastName: 'Bartowski',
      username: 'chuck',
      email: 'chuck@nerdherd.com',
      birthdate: new Date(1989, 7, 16)
    });
  }

  private buildSession(user: User) {
    return new Session({ user });
  }
}
