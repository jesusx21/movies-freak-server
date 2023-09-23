import { expect } from 'chai';

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

    expect(userCreated).to.be.instanceOf(User);
    expect(userCreated.id).to.exist;
    expect(userCreated.name).to.be.equal('Peter');
    expect(userCreated.lastName).to.be.equal('Parker');
    expect(userCreated.username).to.be.equal('peterB');
    expect(userCreated.email).to.be.equal('peterb@gmail.com');
    expect(userCreated.birthdate).to.be.deep.equal(this.user.birthdate);

    expect(userCreated._password).to.be.not.equal('Password1.');
    expect(userCreated._password.salt).to.exist;
    expect(userCreated._password.hash).to.exist;
  }

  async testThrownErrorOnRepeatedEmail() {
    await this._database.users.create(this.user);

    this.user.username = 'peter';

    await expect(
      this._database.users.create(this.user)
    ).to.be.rejectedWith(EmailAlreadyExists);
  }

  async testThrownErrorOnRepeatedUsername() {
    await this._database.users.create(this.user);

    this.user.email = 'peterb@gmail.com';

    await expect(
      this._database.users.create(this.user)
    ).to.be.rejectedWith(UsernameAlreadyExists);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.users, '_connection')
      .throws(new Error());

    await expect(
      this._database.users.create(this.user)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}

export class FindUserByIdTest extends UsersStoreTest {
  async testFindById() {
    const user = await this._database.users.findById(this.users[1].id);

    expect(user).to.be.instanceOf(User);
    expect(user.username).to.be.equal('columbia');
    expect(user.email).to.be.equal('columbia@gmail.com');
  }

  async testThrowsErrorWhenUserIsNotFound() {
    expect(
      this._database.users.findById(this.generateUUID())
    ).to.be.rejectedWith(UserNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this._database.users, '_connection')
      .throws(new Error());

    await expect(
      this._database.users.findById(this.users[2].id)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}
