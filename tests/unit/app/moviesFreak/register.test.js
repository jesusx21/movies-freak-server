import { expect } from 'chai';

import TestCase from '../../../testHelper';

import Register from '../../../../app/moviesFreak/register';
import { Session, User } from '../../../../app/moviesFreak/entities';
import {
  CouldNotRegister,
  EmailAlreadyUsed
} from '../../../../app/moviesFreak/errors';
import { DatabaseError } from '../../../../database/stores/errors';

export class RegisterTest extends TestCase {
  setUp() {
    super.setUp();

    this._database = this.getDatabase();
    this.userData = {
      name: 'Edward',
      lastName: 'Cullen',
      username: 'eddy',
      email: 'eddy@yahoo.com',
      password: 'Password1',
      birthdate: new Date('1895-12-31')
    };

    this.useCase = new Register(this._database, this.userData);
  }

  async testRegisterUser() {
    const session = await this.useCase.execute();

    expect(session).to.be.instanceOf(Session);
    expect(session.token).to.exist;
    expect(session.expiresAt).to.be.greaterThan(new Date());
    expect(session.isActive).to.be.true;

    expect(session.user).to.be.instanceOf(User);
    expect(session.user.name).to.be.equal('Edward');
    expect(session.user.lastName).to.be.equal('Cullen');
    expect(session.user.username).to.be.equal('eddy');
    expect(session.user.email).to.be.equal('eddy@yahoo.com');
    expect(session.user.birthdate).to.be.deep.equal(this.userData.birthdate);
  }

  async testThrowErrorOnEmailAlreadyUsed() {
    await this.useCase.execute();
    this.userData.username = 'edward';

    const useCase = new Register(this._database, this.userData);

    expect(
      useCase.execute()
    ).to.be.rejectedWith(EmailAlreadyUsed);
  }

  async testThrowErrorOnUsernameAlreadyUsed() {
    await this.useCase.execute();
    this.userData.email = 'eddy@hotmail.com';

    const useCase = new Register(this._database, this.userData);

    expect(
      useCase.execute()
    ).to.be.rejectedWith(EmailAlreadyUsed);
  }

  async testThrowErrorWhenSavingUser() {
    this.stubFunction(this._database.users, 'create')
      .throws(new DatabaseError());

    expect(
      this.useCase.execute()
    ).to.be.rejectedWith(CouldNotRegister);
  }

  async testThrowErrorWhenCreateSession() {
    this.stubFunction(this._database.sessions, 'create')
      .throws(new DatabaseError());

    expect(
      this.useCase.execute()
    ).to.be.rejectedWith(CouldNotRegister);
  }
}
