import TestCase from '../../../../testHelper';

import { User } from '../../../../../app/moviesFreak/entities';

export class UserTest extends TestCase {
  user?: User;

  setUp() {
    super.setUp();

    this.user = new User({
      name: 'Charles',
      lastName: 'Bartowski',
      username: 'chuck',
      email: 'chuck@nerdherd.com',
      birthdate: new Date(1989, 7, 16)
    });
  }

  testAddPassword() {
    this.user?.addPassword('Password1');

    this.assertThat(this.user?.password).doesExist();
    this.assertThat(this.user?.password).hasKeys('salt', 'hash');
    this.assertThat(this.user?.password.salt).doesExist();
    this.assertThat(this.user?.password.hash).doesExist();
  }

  testDoesPasswordMatchReturnsTrueWhenPasswordMatch() {
    this.user?.addPassword('Password1');

    this.assertThat(this.user?.doesPasswordMatch('Password1')).isTrue();
  }

  testDoesPasswordMatchReturnsFalseWhenPasswordDoesntMatch() {
    this.user?.addPassword('Password1');

    this.assertThat(this.user?.doesPasswordMatch('Password')).isFalse();
  }
}
