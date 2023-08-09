import { expect } from 'chai';

import APITestCase from '../../apiTestHelper';

export default class GetTVSerieByIdTest extends APITestCase {
  async setUp() {
    super.setUp();

    this._database = this.getDatabase();
    this.buildTestApp(this._database);

    this.tvSeries = await this.createTVSeries(this._database, 5);
  }

  async testGetTVSerieById() {
    const result = await this.simulateGet({
      path: `/tv-series/${this.tvSeries[2].id}`
    });

    expect(result.id).to.be.equal(this.tvSeries[2].id);
    expect(result.name).to.be.equal(this.tvSeries[2].name);
  }

  async testReturnHandledErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvSeries, 'findById')
      .throws(new Error());

    const result = await this.simulateGet({
      path: `/tv-series/${this.tvSeries[1].id}`,
      statusCode: 500
    });

    expect(result.code).to.be.equal('UNEXPECTED_ERROR');
  }
}
