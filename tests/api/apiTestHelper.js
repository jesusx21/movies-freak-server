import request from 'supertest';

import TestCase from '../testHelper';
import imdbFactory from '../../app/imdb/factory';
import MoviesFreakApp from '../../api';

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
}
