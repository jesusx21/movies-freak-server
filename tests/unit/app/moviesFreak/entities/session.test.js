/* eslint-disable no-return-assign */
import { expect } from 'chai';

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

    expect(this.session.user).to.be.deep.equal(this.user);
  }

  testThrowsErrorOnUserAlreadySet() {
    this.session.user = this.user;

    expect(
      () => this.session.user = this.user
    ).to.throws(ReadOnlyField);
  }

  testSetToken() {
    this.session.token = 'fake-token';

    expect(this.session.token).to.be.deep.equal('fake-token');
  }

  testThrowsErrorOnTokenAlreadySet() {
    this.session.token = 'fake-token';

    expect(
      () => this.session.token = 'fake-token'
    ).to.throws(ReadOnlyField);
  }

  testSetExpiresAt() {
    this.session.expiresAt = new Date();

    expect(this.session.expiresAt).to.exist;
  }

  testThrowsErrorOnExpiresAtAlreadySet() {
    this.session.expiresAt = new Date();

    expect(
      () => this.session.expiresAt = new Date()
    ).to.throws(ReadOnlyField);
  }

  testSetIsActive() {
    this.session.isActive = true;

    expect(this.session.isActive).to.be.true;
  }

  testThrowsErrorOnIsActiveAlreadySet() {
    this.session.isActive = false;

    expect(
      () => this.session.isActive = true
    ).to.throws(ReadOnlyField);
  }

  testGenerateToken() {
    this.session.user = this.user;
    this.session.token = 'fake-token';
    this.session.expiresAt = new Date();
    this.session.isActive = true;

    this.session.generateToken('test');

    expect(this.session.token).to.exist;
    expect(this.session.token).to.not.be.equal('fake-token');
    expect(this.session.expiresAt).to.be.null;
    expect(this.session.isActive).to.be.false;
  }

  testActivateToken() {
    this.session.user = this.user;
    this.session.generateToken('test');

    this.session.activateToken();

    expect(this.session.token).to.not.be.equal('fake-token');
    expect(this.session.expiresAt).to.be.greaterThan(new Date());
    expect(this.session.isActive).to.be.true;
  }

  testThrowsErrorTokenAlreadyActived() {
    this.session.user = this.user;
    this.session.generateToken('test')
      .activateToken();

    expect(
      () => this.session.activateToken()
    ).to.throws(SessionAlreadyActive);
  }

  testReturnTrueWhenIsExpired() {
    this.session.expiresAt = new Date('2023-01-01');

    expect(this.session.isExpired()).to.be.true;
  }

  testReturnFalseWhenIsExpired() {
    this.session.user = this.user;
    this.session.generateToken('test')
      .activateToken();

    expect(this.session.isExpired()).to.be.false;
  }

  testReactivateToken() {
    this.session.user = this.user;
    this.session.generateToken('test')
      .activateToken();

    this.session.reactivateToken();

    expect(this.session.token).to.not.be.equal('fake-token');
    expect(this.session.expiresAt).to.be.greaterThan(new Date());
    expect(this.session.isActive).to.be.true;
  }

  testDeactivateToken() {
    this.session.user = this.user;
    this.session.generateToken('test')
      .activateToken();

    this.session.deactivateToken();

    expect(this.session.expiresAt).to.be.lessThanOrEqual(new Date());
    expect(this.session.isActive).to.be.false;
  }
}
