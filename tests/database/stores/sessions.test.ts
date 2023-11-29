import SQLTestCase from '../testHelper';

import SQLDatabase from '../../../database/stores/sql';
import { FixturesGeneratorOptions } from '../../fixtures';
import { Session, User } from '../../../app/moviesFreak/entities';
import { SessionNotFound } from '../../../database/stores/errors';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { UUID } from '../../../typescript/customTypes';

class SessionsStoreTest extends SQLTestCase {
  database: SQLDatabase;
  user: User;
  sessions: Session[];

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();
    this.user = await this.createUser(this.database, { username: 'jesusx21' });
    this.sessions = await this.createSessions(this.user, { quantity: 5 });
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }

  protected async createSessions(user: User, options?: FixturesGeneratorOptions) {
    const { quantity = 1 } = options || {};

    const fixtures = this.generateFixtures({
      quantity,
      type: 'session'
    });

    return Promise.all(
      fixtures.map((data: any) => {
        const session = new Session({ ...data, isActive: false, user });
        return this.database.sessions.create(session);
      })
    );
  }
}

export class CreateSessionTest extends SessionsStoreTest {
  session: Session;

  async setUp() {
    await super.setUp();

    this.session = new Session({ user: this.user });
    this.session.generateToken()
      .activateToken();
  }

  async testCreateSession() {
    const sessionCreated = await this.database.sessions.create(this.session);

    this.assertThat(sessionCreated).isInstanceOf(Session);
    this.assertThat(sessionCreated.id).doesExist();
    this.assertThat(sessionCreated.user?.id).isEqual(this.user.id);
    this.assertThat(sessionCreated.token).isEqual(this.session.token);
    this.assertThat(sessionCreated.expiresAt).isEqual(this.session.expiresAt);
    this.assertThat(sessionCreated.isActive).isTrue();
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.database.sessions, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.sessions.create(this.session)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindActiveSessionByUserIdTest extends SessionsStoreTest {
  userId: UUID;

  async setUp() {
    await super.setUp();

    this.userId = this.user?.id || this.generateUUID();
  }

  async testFindActiveByUserId() {
    const sessionActived = await this.createSession(this.database, this.user);
    await this.createSessions(this.user, { quantity: 5 });

    const sessionFound = await this.database.sessions.findActiveByUserId(this.userId);

    this.assertThat(sessionFound).isInstanceOf(Session);
    this.assertThat(sessionFound.id).isEqual(sessionActived.id);
    this.assertThat(sessionFound.isActive).isTrue();
  }

  async testThrowsErrorWhenUserHasNotActriveSessions() {
    await this.assertThat(
      this.database.sessions.findActiveByUserId(this.userId)
    ).willBeRejectedWith(SessionNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.sessions, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.sessions.findActiveByUserId(this.userId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class UpdateSessionTest extends SessionsStoreTest {
  async testUpdateTokenGenerated() {
    const session = this.sessions[1];

    session.generateToken();

    const sessionUpdated = await this.database.sessions.update(session);

    this.assertThat(sessionUpdated.id).isEqual(session.id);
    this.assertThat(sessionUpdated.token).isNotEqual(this.sessions[1].token);
    this.assertThat(sessionUpdated.expiresAt).doesNotExist();
    this.assertThat(sessionUpdated.isActive()).isFalse();
  }

  async testUpdateTokenActivation() {
    const session = this.sessions[1];

    session.generateToken()
      .activateToken();

    const sessionUpdated = await this.database.sessions.update(session);

    this.assertThat(sessionUpdated.token).isNotEqual(this.sessions[1].token);
    this.assertThat(sessionUpdated.expiresAt).doesExist();
    this.assertThat(sessionUpdated.isActive()).isTrue();
  }

  async testNotUpdateNotEditableFields() {
    const session = this.sessions[1];

    session.createdAt = new Date();
    const sessionUpdated = await this.database.sessions.update(session);

    this.assertThat(sessionUpdated.createdAt).isNotEqual(session.createdAt);
  }

  async testThrowNotFoundWhenSessionDoesNotExist() {
    const session = this.sessions[1];
    session.id = this.generateUUID();

    this.assertThat(
      this.database.sessions.update(session)
    ).willBeRejectedWith(SessionNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.database.sessions, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.sessions.update(this.sessions[1])
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
