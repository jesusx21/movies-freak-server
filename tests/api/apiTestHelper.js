import request from 'supertest';
import { omit } from 'lodash';
import { VError } from 'verror';

import TestCase from '../testHelper';
import imdbFactory from '../../app/imdb/factory';
import MoviesFreakApp from '../../api';

class InvalidSessionData extends VError {
  get name() {
    return this.constructor.name;
  }
}

export default class APITestCase extends TestCase {
  buildTestApp(db) {
    const imdbGateway = imdbFactory('dummy');
    const moviesFreakApp = new MoviesFreakApp(db, imdbGateway);

    moviesFreakApp.build();

    this._app = moviesFreakApp._app;

    this._app.imdb = imdbGateway;

    return this._app;
  }

  async simulatePost(params) {
    const {
      path,
      payload = {},
      statusCode = 201
    } = params;

    const { body } = await request(this._app)
      .post(`/movies-freak/api/v1${path}`)
      .send(payload)
      .expect(statusCode);

    return body;
  }

  async simulateGet(params) {
    const {
      path,
      query = {},
      statusCode = 200
    } = params;

    const { body } = await request(this._app)
      .get(`/movies-freak/api/v1${path}`)
      .query(query)
      .expect(statusCode);

    return body;
  }

  async registerUser(data) {
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

    return this.simulatePost({
      path: '/sign-up',
      payload: { ...omit(userData, ['id', 'createdAt', 'updatedAt']), password: data.password }
    });
  }
}
