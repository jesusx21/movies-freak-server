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

    this.assertThat(result.id).isEqual(this.tvSeries[2].id);
    this.assertThat(result.name).isEqual(this.tvSeries[2].name);
  }

  async testReturnHandledErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvSeries, 'findById')
      .throws(new Error());

    const result = await this.simulateGet({
      path: `/tv-series/${this.tvSeries[1].id}`,
      statusCode: 500
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
