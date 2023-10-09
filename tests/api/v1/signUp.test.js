import APITestCase from '../apiTestHelper';
import SignUp from '../../../app/moviesFreak/signUp';

export class SignUpTest extends APITestCase {
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

  async testSignUpUser() {
    const result = await this.simulatePost({
      path: '/sign-up',
      payload: this.userData
    });

    this.assertThat(result.id).doesExist();
    this.assertThat(result.token).doesExist();
    this.assertThat(new Date(result.expiresAt)).isGreaterThan(new Date());
    this.assertThat(result.isActive).isTrue();
    this.assertThat(result.user.id).doesExist();
    this.assertThat(result.user.name).isEqual('Evan');
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

    this.assertThat(result.code).isEqual('EMAIL_ALREADY_USED');
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

    this.assertThat(result.code).isEqual('USERNAME_ALREADY_USED');
  }

  async testReturnHandledErrorOnUnexpectedError() {
    this.mockClass(SignUp, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulatePost({
      path: '/sign-up',
      payload: this.userData,
      statusCode: 500
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
