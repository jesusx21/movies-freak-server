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

    this.assertThat(sessionCreated).isInstanceOf(Session);
    this.assertThat(sessionCreated.id).doesExist();
    this.assertThat(sessionCreated.user.id).isEqual(this.user.id);
    this.assertThat(sessionCreated.token).isEqual(this.session.token);
    this.assertThat(sessionCreated.expiresAt).isEqual(this.session.expiresAt);
    this.assertThat(sessionCreated.isActive).isTrue();
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.sessions, '_connection')
      .throws(new Error());

    await this.assertThat(
      this._database.sessions.create(this.session)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
