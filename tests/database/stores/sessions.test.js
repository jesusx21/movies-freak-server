import { expect } from 'chai';

import SQLTestCase from '../testHelper';

import { Session } from '../../../app/moviesFreak/entities';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';

class SessionsStoreTest extends SQLTestCase {
  async setUp() {
    super.setUp();

    this._database = this.getDatabase();
    this.user = await this.createUser(this._database, { username: 'jesusx21' });
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateSessionTest extends SessionsStoreTest {
  async setUp() {
    await super.setUp();

    this.session = new Session({ user: this.user });
    this.session.generateToken('secret')
      .activateToken();
  }

  async testCreateSession() {
    const sessionCreated = await this._database.sessions.create(this.session);

    expect(sessionCreated).to.be.instanceOf(Session);
    expect(sessionCreated.id).to.exist;
    expect(sessionCreated.user.id).to.be.equal(this.user.id);
    expect(sessionCreated.token).to.be.equal(this.session.token);
    expect(sessionCreated.expiresAt).to.be.deep.equal(this.session.expiresAt);
    expect(sessionCreated.isActive).to.be.true;
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.sessions, '_connection')
      .throws(new Error());

    await expect(
      this._database.sessions.create(this.session)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}
