import { expect } from 'chai';
import APITestCase from '../apiTestHelper';
import Register from '../../../app/moviesFreak/register';

export class RegisterTest extends APITestCase {
  setUp() {
    super.setUp();

    const database = this.getDatabase();

    this.buildTestApp(database);
    this.userData = {
      name: 'Evan',
      lastName: 'Peters',
      email: 'evan@gmail.com',
      username: 'evan',
      password: 'americanHorrorStory12',
      birthdate: new Date('1989-04-29')
    };
  }

  async testRegisterUser() {
    const result = await this.simulatePost({
      path: '/sign-up',
      payload: this.userData
    });

    expect(result.id).to.exist;
    expect(result.token).to.exist;
    expect(new Date(result.expiresAt)).to.be.greaterThan(new Date());
    expect(result.isActive).to.be.true;
    expect(result.user.id).to.exist;
    expect(result.user.name).to.be.equal('Evan');
  }

  async testReturnsErrorOnEmailAlreadyUsed() {
    await this.simulatePost({
      path: '/sign-up',
      payload: this.userData
    });

    this.userData.username = 'pete';

    const result = await this.simulatePost({
      path: '/sign-up',
      payload: this.userData,
      statusCode: 409
    });

    expect(result.code).to.be.equal('EMAIL_ALREADY_USED');
  }

  async testReturnsErrorOnUsernameAlreadyUsed() {
    await this.simulatePost({
      path: '/sign-up',
      payload: this.userData
    });

    this.userData.email = 'pete@gmail.com';

    const result = await this.simulatePost({
      path: '/sign-up',
      payload: this.userData,
      statusCode: 409
    });

    expect(result.code).to.be.equal('USERNAME_ALREADY_USED');
  }

  async testReturnHandledErrorOnUnexpectedError() {
    this.mockClass(Register, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulatePost({
      path: '/sign-up',
      payload: this.userData,
      statusCode: 500
    });

    expect(result.code).to.be.equal('UNEXPECTED_ERROR');
  }
}
