import SignIn from '../../../app/moviesFreak/signIn';
import APITestCase from '../apiTestHelper';
import { Error, Session } from '../../../types/api';
import { Json } from '../../../types/common';
import { SignUpData } from '../../../types/app';

export class SignInTest extends APITestCase {
  private user: Json;

  constructor() {
    super();

    this.user = {
      id: this.generateUUID(),
      name: 'Jon Doe'
    }
  }

  async setUp() {
    super.setUp();

    this.buildTestApp(
      this.getDatabase()
    );

    const session = await this.registerUser();
    this.user = session.user;
  }

  async testSignInWithEmail() {
    const body = await this.simulatePost<Session>({
      path: '/sign-in',
      payload: {
        username: 'chucky@gmail.com',
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

  async testSignInWithUsername() {
    const body = await this.simulatePost<Session>({
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
    const body = await this.simulatePost<Error>({
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
    const body = await this.simulatePost<Error>({
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

    const body = await this.simulatePost<Error>({
      path: '/sign-in',
      payload: {
        username: 'jon@gmail.com',
        password: 'Password123'
      },
      statusCode: 500
    });

    this.assertThat(body.code).isEqual('UNEXPECTED_ERROR');
  }

  registerUser(data?: SignUpData) {
    return super.registerUser({
      ...this.buildUser(),
      ...(data || {})
    });
  }

  private buildUser() {
    return {
      name: 'Charles',
      lastName: 'Lee Ray',
      username: 'chucky',
      email: 'chucky@gmail.com',
      password: 'Password123',
      birthdate: new Date(1972, 3, 14)
    };
  }
}
