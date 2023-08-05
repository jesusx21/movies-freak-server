import request from 'supertest';

import buildTestApp from './testApp';
import TestHelper from '../testHelper';

export default class APITestHelper extends TestHelper {
  buildTestApp(db) {
    this._app = buildTestApp(db);

    return this._app;
  }

  async simulatePost(params) {
    const {
      path,
      payload = {},
      statusCode = 201
    } = params;

    const { body } = await request(this._app._app)
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

    const { body } = await request(this._app._app)
      .get(`/movies-freak/api/v1${path}`)
      .query(query)
      .expect(statusCode);

    return body;
  }
}
