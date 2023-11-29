import SQLTestCase from '../testHelper';

import { User } from '../../../app/moviesFreak/entities';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import {
  EmailAlreadyExists,
  UserNotFound,
  UsernameAlreadyExists
} from '../../../database/stores/errors';
import SQLDatabase from '../../../database/stores/sql';
import { UUID } from '../../../typescript/customTypes';

class UsersStoreTest extends SQLTestCase {
  database: SQLDatabase;
  users: User[];

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();

    this.users = await this.createUsers(this.database, 5, [
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
  user: User;

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
    const userCreated = await this.database.users.create(this.user);

    this.assertThat(userCreated).isInstanceOf(User);
    this.assertThat(userCreated.id).doesExist();
    this.assertThat(userCreated.name).isEqual('Peter');
    this.assertThat(userCreated.lastName).isEqual('Parker');
    this.assertThat(userCreated.username).isEqual('peterB');
    this.assertThat(userCreated.email).isEqual('peterb@gmail.com');
    this.assertThat(userCreated.birthdate).isEqual(this.user.birthdate);

    this.assertThat(userCreated.password).isNotEqual('Password1.');
    this.assertThat(userCreated.password.salt).doesExist();
    this.assertThat(userCreated.password.hash).doesExist();
  }

  async testThrownErrorOnRepeatedEmail() {
    await this.database.users.create(this.user);

    this.user.username = 'peter';

    await this.assertThat(
      this.database.users.create(this.user)
    ).willBeRejectedWith(EmailAlreadyExists);
  }

  async testThrownErrorOnRepeatedUsername() {
    await this.database.users.create(this.user);

    this.user.email = 'peterb@gmail.com';

    await this.assertThat(
      this.database.users.create(this.user)
    ).willBeRejectedWith(UsernameAlreadyExists);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.database.users, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.users.create(this.user)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindUserByIdTest extends UsersStoreTest {
  userId: UUID;

  async setUp() {
    await super.setUp();

    this.userId = this.users[1].id || this.generateUUID();
  }

  async testFindById() {
    const user = await this.database.users.findById(this.userId);

    this.assertThat(user).isInstanceOf(User);
    this.assertThat(user.username).isEqual('columbia');
    this.assertThat(user.email).isEqual('columbia@gmail.com');
  }

  async testThrowsErrorWhenUserIsNotFound() {
    await this.assertThat(
      this.database.users.findById(this.generateUUID())
    ).willBeRejectedWith(UserNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.users, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.users.findById(this.userId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindUserByEmailTest extends UsersStoreTest {
  async testFindByEmail() {
    const user = await this.database.users.findByEmail(this.users[1].email);

    this.assertThat(user).isInstanceOf(User);
    this.assertThat(user.username).isEqual('columbia');
    this.assertThat(user.email).isEqual('columbia@gmail.com');
  }

  async testThrowsErrorWhenUserIsNotFound() {
    await this.assertThat(
      this.database.users.findByEmail('notfound@mail.com')
    ).willBeRejectedWith(UserNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.users, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.users.findByEmail(this.users[2].email)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindUserByUsernameTest extends UsersStoreTest {
  async testFindByUsername() {
    const user = await this.database.users.findByUsername(this.users[1].username);

    this.assertThat(user).isInstanceOf(User);
    this.assertThat(user.username).isEqual('columbia');
    this.assertThat(user.email).isEqual('columbia@gmail.com');
  }

  async testThrowsErrorWhenUserIsNotFound() {
    await this.assertThat(
      this.database.users.findByUsername('notfound')
    ).willBeRejectedWith(UserNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.users, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.users.findByUsername(this.users[2].username)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
