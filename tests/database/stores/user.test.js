import { expect } from 'chai';

import SQLTestCase from '../testHelper';

import { User } from '../../../app/moviesFreak/entities';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { EmailAlreadyExists, UsernameAlreadyExists } from '../../../database/stores/errors';

class UserStoreTest extends SQLTestCase {
  setUp() {
    super.setUp();

    this._database = this.getDatabase();
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateUserTest extends UserStoreTest {
  setUp() {
    super.setUp();

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
