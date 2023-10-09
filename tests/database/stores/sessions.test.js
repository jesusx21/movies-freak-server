import SQLTestCase from '../testHelper';

import { Session } from '../../../app/moviesFreak/entities';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { SessionNotFound } from '../../../database/stores/errors';

class SessionsStoreTest extends SQLTestCase {
  async setUp() {
    super.setUp();

    this._database = this.getDatabase();
    this.user = await this.createUser(this._database, { username: 'jesusx21' });
    this.sessions = await this._createSessions(this.user, { quantity: 5 });
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }

  async _createSessions(user, options) {
    const { quantity = 1 } = options || {};

    const fixtures = this.generateFixtures({
      quantity,
      type: 'session'
    });

    return Promise.all(
      fixtures.map((data) => {
        const session = new Session({ ...data, isActive: false, user });
        return this._database.sessions.create(session);
      })
    );
  }
}

export class CreateSessionTest extends SessionsStoreTest {
  async setUp() {
    await super.setUp();

    this.session = new Session({ user: this.user });
    this.session.generateToken()
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

export class FindActiveSessionByUserIdTest extends SessionsStoreTest {
  async testFindActiveByUserId() {
    const sessionActived = await this.createSession(this._database, this.user);
    await this._createSessions(this.user, { quantity: 5 });

    const sessionFound = await this._database.sessions.findActiveByUserId(this.user.id);

    this.assertThat(sessionFound).isInstanceOf(Session);
    this.assertThat(sessionFound.id).isEqual(sessionActived.id);
    this.assertThat(sessionFound.isActive).isTrue();
  }

  async testThrowsErrorWhenUserHasNotActriveSessions() {
    await this.assertThat(
      this._database.sessions.findActiveByUserId(this.user.id)
    ).willBeRejectedWith(SessionNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this._database.sessions, '_connection')
      .throws(new Error());

    await this.assertThat(
      this._database.sessions.findActiveByUserId(this.user.id)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class UpdateSessionTest extends SessionsStoreTest {
  async testUpdateToken() {
    const session = this.sessions[1];

    this.assertThat(session.token).isNotEqual('validToken');

    session._token = 'validToken';
    const sessionUpdated = await this._database.sessions.update(session);

    this.assertThat(sessionUpdated.id).isEqual(session.id);
    this.assertThat(sessionUpdated.token).isEqual('validToken');
  }

  async testUpdateExpirationDate() {
    const session = this.sessions[1];

    const date = new Date();

    this.assertThat(session._expiresAt).isNotEqual(date);

    session._expiresAt = date;
    const sessionUpdated = await this._database.sessions.update(session);

    this.assertThat(sessionUpdated.id).isEqual(session.id);
    this.assertThat(sessionUpdated.expiresAt).isEqual(date);
  }

  async testUpdateIsActive() {
    const session = this.sessions[1];

    this.assertThat(session.isActive).isFalse();

    session._isActive = true;
    const sessionUpdated = await this._database.sessions.update(session);

    this.assertThat(sessionUpdated.id).isEqual(session.id);
    this.assertThat(sessionUpdated.isActive).isTrue();
  }

  async testNotUpdateNotEditableFields() {
    const session = this.sessions[1];

    session._createdAt = new Date();
    const sessionUpdated = await this._database.sessions.update(session);

    this.assertThat(sessionUpdated.createdAt).isNotEqual(session.createdAt);
  }

  async testThrowNotFoundWhenSessionDoesNotExist() {
    const session = this.sessions[1];
    session._id = this.generateUUID();

    this.assertThat(
      this._database.sessions.update(session)
    ).willBeRejectedWith(SessionNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this._database.sessions, '_connection')
      .throws(new Error());

    await this.assertThat(
      this._database.sessions.update(this.sessions[1])
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
