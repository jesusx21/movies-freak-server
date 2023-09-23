import { expect } from 'chai';

import TestCase from '../../../../testHelper';

import { User } from '../../../../../app/moviesFreak/entities';

export class UserTest extends TestCase {
  setUp() {
    super.setUp();

    this.user = new User({
      name: 'Charles',
      lastName: 'Bartowski',
      username: 'chuck',
      email: 'chuck@nerdherd.com'
    });
  }

  testAddPassword() {
    this.user.addPassword('Password1');

    expect(this.user._password).to.exist;
    expect(this.user._password).to.have.keys('salt', 'hash');
    expect(this.user._password.salt).to.exist;
    expect(this.user._password.hash).to.exist;
  }

  testDoesPasswordMatchReturnsTrueWhenPasswordMatch() {
    this.user.addPassword('Password1');

    expect(this.user.doesPasswordMatch('Password1')).to.be.true;
  }

  testDoesPasswordMatchReturnsFalseWhenPasswordDoesntMatch() {
    this.user.addPassword('Password1');

    expect(this.user.doesPasswordMatch('Password')).to.be.false;
  }
}
