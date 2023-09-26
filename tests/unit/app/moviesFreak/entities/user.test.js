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

    this.assertThat(this.user._password).doesExist();
    this.assertThat(this.user._password).hasKeys('salt', 'hash');
    this.assertThat(this.user._password.salt).doesExist();
    this.assertThat(this.user._password.hash).doesExist();
  }

  testDoesPasswordMatchReturnsTrueWhenPasswordMatch() {
    this.user.addPassword('Password1');

    this.assertThat(this.user.doesPasswordMatch('Password1')).isTrue();
  }

  testDoesPasswordMatchReturnsFalseWhenPasswordDoesntMatch() {
    this.user.addPassword('Password1');

    this.assertThat(this.user.doesPasswordMatch('Password')).isFalse();
  }
}
