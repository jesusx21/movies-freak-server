import request from 'supertest';

import TestHelper from '../testHelper';
import createTestApp from './testApp';

class MissingDatabase extends Error {}

export default class APITestHelper extends TestHelper {
  buildTestApp() {
    if (!this._database) {
      throw new MissingDatabase();
    }

    this._app = createTestApp(this._database);
  }

  getApp() {
    return this._app;
  }

  getDatabase() {
    return this._database;
  }

  getIMDB() {
    return this._app.imdb;
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

  stubAppFunction(instanceName, functionName) {
    return this.stubFunction(this._app[instanceName], functionName);
  }

  spyAppFunction(instanceName, functionName) {
    return this.spyFunction(this._app[instanceName], functionName);
  }
}
