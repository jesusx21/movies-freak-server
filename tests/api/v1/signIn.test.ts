import SignIn from '../../../app/moviesFreak/signIn';
import APITestCase, { UserFixture } from '../apiTestHelper';
import { Database } from '../../../database';
import { Session } from '../../../app/moviesFreak/entities';

export class SignInTest extends APITestCase {
  private user: UserFixture;

  async setUp() {
    super.setUp();

    const database: Database = this.getDatabase();

    this.buildTestApp(database);

    this.user = await this.registerUser({
      name: 'Charles',
      lastName: 'Lee Ray',
      username: 'chucky',
      email: 'chucky@gmail.com',
      password: 'Password123',
      birthdate: new Date(1972, 3, 14)
    });
  }

  async testSignInWithEmail() {
    const body = await this.simulatePost({
      path: '/sign-in',
      payload: {
        username: 'chucky@gmail.com',
        password: 'Password123'
      },
      statusCode: 200
    });

    this.assertThat(body?.id).doesExist();
    this.assertThat(body.token).doesExist();
    this.assertThat(new Date(body.expiresAt)).isGreaterThan(new Date());
    this.assertThat(body.isActive).isTrue();
    this.assertThat(body.user.id).isEqual(this.user.id);
    this.assertThat(body.user.name).isEqual(this.user.name);
  }

  async testSignInWithUsername() {
    const body = await this.simulatePost({
      path: '/sign-in',
      payload: {
        username: 'chucky',
        password: 'Password123'
      },
      statusCode: 200
    });

    this.assertThat(body.id).doesExist();
    this.assertThat(body.token).doesExist();
    this.assertThat(new Date(body.expiresAt)).isGreaterThan(new Date());
    this.assertThat(body.isActive).isTrue();
    this.assertThat(body.user.id).isEqual(this.user.id);
    this.assertThat(body.user.name).isEqual(this.user.name);
  }

  async testReturnErrorWhenUsernameIsNotRegister() {
    const body = await this.simulatePost({
      path: '/sign-in',
      payload: {
        username: 'jon',
        password: 'Password123'
      },
      statusCode: 404
    });

    this.assertThat(body.code).isEqual('USER_NOT_FOUND');
  }

  async testReturnErrorWhenEmailIsNotRegister() {
    const body = await this.simulatePost({
      path: '/sign-in',
      payload: {
        username: 'jon@gmail.com',
        password: 'Password123'
      },
      statusCode: 404
    });

    this.assertThat(body.code).isEqual('USER_NOT_FOUND');
  }

  async testReturnErrorOnUnexpectedError() {
    this.mockClass(SignIn, 'instance')
      .expects('execute')
      .throws(new Error());

    const body = await this.simulatePost({
      path: '/sign-in',
      payload: {
        username: 'jon@gmail.com',
        password: 'Password123'
      },
      statusCode: 500
    });

    this.assertThat(body.code).isEqual('UNEXPECTED_ERROR');
  }
}
