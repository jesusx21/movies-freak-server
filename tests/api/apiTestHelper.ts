import request from 'supertest';
import { omit } from 'lodash';
import { ClasspuccinoError } from '../../classpuccino/errors';

import buildTestApp from './testApp';
import MoviesFreakApp from '../../api/index';
import TestCase from '../testHelper';
import { Database } from '../../database';
import { UserParams } from '../../app/moviesFreak/entities/user';

enum HTTPStatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  conflict = 409,
  preconditionFailed = 412,
  serverError = 500
}

interface RequestParams {
  path: string;
  token?: string;
  statusCode?: HTTPStatusCode;
}

interface PostRequestParams extends RequestParams{
  payload: {}
}

interface GetRequestParams extends RequestParams{
  query: {}
}

export interface UserFixture extends UserParams {
  password: string;
}

class InvalidSessionData extends ClasspuccinoError {
  constructor(message: string) {
    super({ message });
  }
}

class APITestCase extends TestCase {
  private app: MoviesFreakApp;

  buildTestApp(database: Database) {
    this.app = buildTestApp(database);

    return this.app;
  }

  async simulatePost<T>(params: PostRequestParams): Promise<T> {
    const {
      path,
      payload = {},
      statusCode = 201
    } = params;

    const { body } = await request(this.app)
      .post(`/movies-freak/api/v1${path}`)
      .send(payload)
      .expect(statusCode);

    return body;
  }

  async simulateGet<T>(params: GetRequestParams): Promise<T> {
    const {
      path,
      query = {},
      statusCode = 200
    } = params;

    const { body } = await request(this.app)
      .get(`/movies-freak/api/v1${path}`)
      .query(query)
      .expect(statusCode);

    return body;
  }

  async registerUser(data: UserFixture) {
    const [userData] = this.generateFixtures({
      type: 'user',
      recipe: [omit(data, 'password')]
    });

    if (!data.username && !data.email) {
      throw new InvalidSessionData('One of username or email is required for register user');
    }

    if (!data.password) {
      throw new InvalidSessionData('Password is required for register user');
    }

    return this.simulatePost<UserFixture>({
      path: '/sign-up',
      payload: { ...omit(userData, ['id', 'createdAt', 'updatedAt']), password: data.password }
    });
  }
}

export default APITestCase;
