/* eslint-disable no-return-assign */
import TestCase from '../../../../testHelper';

import { Session, User } from '../../../../../app/moviesFreak/entities';
import {
  ReadOnlyField,
  SessionAlreadyActive
} from '../../../../../app/moviesFreak/entities/errors';

export class SessionTest extends TestCase {
  session: Session;
  user: User;

  setUp() {
    this.user = new User({
      name: 'Charles',
      lastName: 'Bartowski',
      username: 'chuck',
      email: 'chuck@nerdherd.com',
      birthdate: new Date(1989, 7, 16)
    });

    this.session = new Session({ user: this.user });
  }

  testSetUser() {
    this.session.user = this.user;

    this.assertThat(this.session.user).isEqual(this.user);
  }

  testThrowsErrorOnUserAlreadySet() {
    this.session.user = this.user;

    this.assertThat(
      () => this.session.user = this.user
    ).willThrow(ReadOnlyField);
  }

  testGenerateToken() {
    this.session.user = this.user;

    this.session.generateToken();

    this.assertThat(this.session.token).doesExist();
    this.assertThat(this.session.token).isNotEqual('fake-token');
    this.assertThat(this.session.expiresAt).isNull();
    this.assertThat(this.session.isActive).isFalse();
  }

  testActivateToken() {
    this.session.user = this.user;
    this.session.generateToken();

    this.session.activateToken();

    this.assertThat(this.session.token).isNotEqual('fake-token');
    this.assertThat(this.session.expiresAt).isGreaterThan(new Date());
    this.assertThat(this.session.isActive).isTrue();
  }

  testThrowsErrorTokenAlreadyActived() {
    this.session.user = this.user;
    this.session.generateToken()
      .activateToken();

    this.assertThat(
      () => this.session.activateToken()
    ).willThrow(SessionAlreadyActive);
  }

  testReturnTrueWhenIsExpired() {
    this.mockDate(2023, 1, 1);

    this.assertThat(this.session.isExpired()).isTrue();
  }

  testReturnFalseWhenIsExpired() {
    this.session.user = this.user;
    this.session.generateToken()
      .activateToken();

    this.assertThat(this.session.isExpired()).isFalse();
  }

  testReactivateToken() {
    this.session.user = this.user;
    this.session.generateToken()
      .activateToken();

    this.session.reactivateToken();

    this.assertThat(this.session.token).isNotEqual('fake-token');
    this.assertThat(this.session.expiresAt).isGreaterThan(new Date());
    this.assertThat(this.session.isActive).isTrue();
  }

  testDeactivateToken() {
    this.session.user = this.user;
    this.session.generateToken()
      .activateToken();

    this.session.deactivateToken();

    this.assertThat(this.session.expiresAt).isLessThanOrEqual(new Date());
    this.assertThat(this.session.isActive).isFalse();
  }
}
