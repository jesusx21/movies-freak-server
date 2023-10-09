/* eslint-disable no-return-assign */
import TestCase from '../../../../testHelper';

import { Session, User } from '../../../../../app/moviesFreak/entities';
import {
  ReadOnlyField,
  SessionAlreadyActive
} from '../../../../../app/moviesFreak/entities/errors';

export class SessionTest extends TestCase {
  setUp() {
    this.user = new User({ email: 'ramona@gmail.com' });
    this.session = new Session({});
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

  testSetToken() {
    this.session.token = 'fake-token';

    this.assertThat(this.session.token).isEqual('fake-token');
  }

  testThrowsErrorOnTokenAlreadySet() {
    this.session.token = 'fake-token';

    this.assertThat(
      () => this.session.token = 'fake-token'
    ).willThrow(ReadOnlyField);
  }

  testSetExpiresAt() {
    this.session.expiresAt = new Date();

    this.assertThat(this.session.expiresAt).doesExist();
  }

  testThrowsErrorOnExpiresAtAlreadySet() {
    this.session.expiresAt = new Date();

    this.assertThat(
      () => this.session.expiresAt = new Date()
    ).willThrow(ReadOnlyField);
  }

  testSetIsActive() {
    this.session.isActive = true;

    this.assertThat(this.session.isActive).isTrue();
  }

  testThrowsErrorOnIsActiveAlreadySet() {
    this.session.isActive = false;

    this.assertThat(
      () => this.session.isActive = true
    ).willThrow(ReadOnlyField);
  }

  testGenerateToken() {
    this.session.user = this.user;
    this.session.token = 'fake-token';
    this.session.expiresAt = new Date();
    this.session.isActive = true;

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
    this.session.expiresAt = new Date('2023-01-01');

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
