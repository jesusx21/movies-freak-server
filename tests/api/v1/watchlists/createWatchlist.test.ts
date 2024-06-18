import CreateWatchlist from '../../../../app/moviesFreak/createWatchlist';
import { APIError, Session } from '../../../../types/api';
import { SignUpData } from '../../../../types/app';
import { Json } from '../../../../types/common';
import { Privacity } from '../../../../types/entities';
import APITestCase from '../../apiTestHelper';

export class CreateWatchlistTest extends APITestCase {
  session: any;

  async setUp() {
    super.setUp();

    this.buildTestApp(
      this.getDatabase()
    );

    this.session = await this.registerUser();
  }

  async testCreateWatchlist() {
    const body = await this.simulatePost<Json>({
      path: '/watchlists',
      payload: {
        name: 'Horroctober',
        description: 'A watchlist for your halloween marathon',
        privacity: Privacity.SHARED
      },
      authorization: `Bearer ${this.session.token}`,
      statusCode: 201
    });

    this.assertThat(body.id).doesExist();
    this.assertThat(body.name).isEqual('Horroctober');
    this.assertThat(body.userId).isEqual(this.session.user.id);
    this.assertThat(body.description).isEqual('A watchlist for your halloween marathon');
    this.assertThat(body.privacity).isEqual(Privacity.SHARED);
    this.assertThat(body.createdAt).doesExist();
    this.assertThat(body.updatedAt).doesExist();
  }

  async testReturnHandledErrorOnTokenNotSent() {
    const result = await this.simulatePost<APIError>({
      path: '/watchlists',
      payload: {
        name: 'Horroctober',
        description: 'A watchlist for your halloween marathon',
        privacity: Privacity.SHARED
      },
      statusCode: 401
    });

    this.assertThat(result.code).isEqual('UNAUTHORIZED');
  }

  async testReturnHandledErroWhenTokenIsNotBearer() {
    const result = await this.simulatePost<APIError>({
      path: '/watchlists',
      payload: {
        name: 'Horroctober',
        description: 'A watchlist for your halloween marathon',
        privacity: Privacity.SHARED
      },
      authorization: `${this.session.token}`,
      statusCode: 401
    });

    this.assertThat(result.code).isEqual('EXPECTED_BEARER_TOKEN');
  }

  async testReturnHandledErroWhenTokenIsInvalid() {
    const result = await this.simulatePost<APIError>({
      path: '/watchlists',
      payload: {
        name: 'Horroctober',
        description: 'A watchlist for your halloween marathon',
        privacity: Privacity.SHARED
      },
      authorization: `${this.session.token}`,
      statusCode: 401
    });

    this.assertThat(result.code).isEqual('EXPECTED_BEARER_TOKEN');
  }

  async testReturnHandledErrorOnUnexpectedError() {
    this.mockClass(CreateWatchlist, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulatePost<APIError>({
      path: '/watchlists',
      payload: {
        name: 'Horroctober',
        description: 'A watchlist for your halloween marathon',
        privacity: Privacity.SHARED
      },
      authorization: `Bearer ${this.session.token}`,
      statusCode: 500
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
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
