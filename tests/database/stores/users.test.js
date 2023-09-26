import SQLTestCase from '../testHelper';

import { User } from '../../../app/moviesFreak/entities';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import {
  EmailAlreadyExists,
  UserNotFound,
  UsernameAlreadyExists
} from '../../../database/stores/errors';

class UsersStoreTest extends SQLTestCase {
  async setUp() {
    super.setUp();

    this._database = this.getDatabase();

    this.users = await this.createUsers(this._database, 5, [
      { username: 'rocky', email: 'rocky@gmail.com' },
      { username: 'columbia', email: 'columbia@gmail.com' },
      { username: 'magenta', email: 'magenta@gmail.com' }
    ]);
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateUserTest extends UsersStoreTest {
  async setUp() {
    await super.setUp();

    this.user = new User({
      name: 'Peter',
      lastName: 'Parker',
      username: 'peterB',
      email: 'peterb@gmail.com',
      birthdate: new Date(1989, 7, 16)
    });

    this.user.addPassword('Password1.');
  }

  async testCreateUser() {
    const userCreated = await this._database.users.create(this.user);

    this.assertThat(userCreated).isInstanceOf(User);
    this.assertThat(userCreated.id).doesExist();
    this.assertThat(userCreated.name).isEqual('Peter');
    this.assertThat(userCreated.lastName).isEqual('Parker');
    this.assertThat(userCreated.username).isEqual('peterB');
    this.assertThat(userCreated.email).isEqual('peterb@gmail.com');
    this.assertThat(userCreated.birthdate).isEqual(this.user.birthdate);

    this.assertThat(userCreated._password).isNotEqual('Password1.');
    this.assertThat(userCreated._password.salt).doesExist();
    this.assertThat(userCreated._password.hash).doesExist();
  }

  async testThrownErrorOnRepeatedEmail() {
    await this._database.users.create(this.user);

    this.user.username = 'peter';

    await this.assertThat(
      this._database.users.create(this.user)
    ).willBeRejectedWith(EmailAlreadyExists);
  }

  async testThrownErrorOnRepeatedUsername() {
    await this._database.users.create(this.user);

    this.user.email = 'peterb@gmail.com';

    await this.assertThat(
      this._database.users.create(this.user)
    ).willBeRejectedWith(UsernameAlreadyExists);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.users, '_connection')
      .throws(new Error());

    await this.assertThat(
      this._database.users.create(this.user)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindUserByIdTest extends UsersStoreTest {
  async testFindById() {
    const user = await this._database.users.findById(this.users[1].id);

    this.assertThat(user).isInstanceOf(User);
    this.assertThat(user.username).isEqual('columbia');
    this.assertThat(user.email).isEqual('columbia@gmail.com');
  }

  async testThrowsErrorWhenUserIsNotFound() {
    await this.assertThat(
      this._database.users.findById(this.generateUUID())
    ).willBeRejectedWith(UserNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this._database.users, '_connection')
      .throws(new Error());

    await this.assertThat(
      this._database.users.findById(this.users[2].id)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
