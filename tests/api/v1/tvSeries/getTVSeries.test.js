import APITestCase from '../../apiTestHelper';

export default class GetTVSeriesTest extends APITestCase {
  setUp() {
    super.setUp();

    this._database = this.getDatabase();
    this.buildTestApp(this._database);
  }

  async testGetTVSeries() {
    await this.createTVSeries(this._database, 5);

    const result = await this.simulateGet({
      path: '/tv-series'
    });

    this.assertThat(result.items).hasLengthOf(5);
    this.assertThat(result.totalItems).isEqual(5);
    this.assertThat(result.skip).isEqual(0);
    this.assertThat(result.limit).isEqual(25);
  }

  async testGetTVSeriesWithSkip() {
    await this.createTVSeries(
      this._database,
      [
        { name: 'How I Met Your Mother' },
        { name: 'How I Met Your Father' },
        { name: 'Star Wars: Clone Wars' },
        { name: 'Star Wars: Rebels' },
        { name: 'Friends' }
      ]
    );

    const result = await this.simulateGet({
      path: '/tv-series',
      query: { skip: 2 }
    });

    this.assertThat(result.items).hasLengthOf(3);
    this.assertThat(result.totalItems).isEqual(5);
    this.assertThat(result.skip).isEqual(2);
    this.assertThat(result.limit).isEqual(25);

    this.assertThat(result.items[0].name).isEqual('Star Wars: Clone Wars');
    this.assertThat(result.items[1].name).isEqual('Star Wars: Rebels');
    this.assertThat(result.items[2].name).isEqual('Friends');
  }

  async testGetTVSeriesWithLimit() {
    await this.createTVSeries(
      this._database,
      [
        { name: 'How I Met Your Mother' },
        { name: 'How I Met Your Father' },
        { name: 'Star Wars: Clone Wars' },
        { name: 'Star Wars: Rebels' },
        { name: 'Friends' }
      ]
    );

    const result = await this.simulateGet({
      path: '/tv-series',
      query: { limit: 3 }
    });

    this.assertThat(result.items).hasLengthOf(3);
    this.assertThat(result.totalItems).isEqual(5);
    this.assertThat(result.skip).isEqual(0);
    this.assertThat(result.limit).isEqual(3);

    this.assertThat(result.items[0].name).isEqual('How I Met Your Mother');
    this.assertThat(result.items[1].name).isEqual('How I Met Your Father');
    this.assertThat(result.items[2].name).isEqual('Star Wars: Clone Wars');
  }

  async testGetTVSeriesWithSkipAndLimit() {
    await this.createTVSeries(
      this._database,
      [
        { name: 'How I Met Your Mother' },
        { name: 'How I Met Your Father' },
        { name: 'Star Wars: Clone Wars' },
        { name: 'Star Wars: Rebels' },
        { name: 'Friends' }
      ]
    );

    const result = await this.simulateGet({
      path: '/tv-series',
      query: { skip: 1, limit: 2 }
    });

    this.assertThat(result.items).hasLengthOf(2);
    this.assertThat(result.totalItems).isEqual(5);
    this.assertThat(result.skip).isEqual(1);
    this.assertThat(result.limit).isEqual(2);

    this.assertThat(result.items[0].name).isEqual('How I Met Your Father');
    this.assertThat(result.items[1].name).isEqual('Star Wars: Clone Wars');
  }

  async testGetEmptyListWhenThereIsNotTVSeries() {
    const result = await this.simulateGet({
      path: '/tv-series'
    });

    this.assertThat(result.items).isEmpty();
    this.assertThat(result.totalItems).isEqual(0);
    this.assertThat(result.skip).isEqual(0);
    this.assertThat(result.limit).isEqual(25);
  }

  async testReturnErrorHandlerOnUnexpectedError() {
    this.stubFunction(this._database.tvSeries, 'find')
      .throws(new Error());

    const result = await this.simulateGet({
      path: '/tv-series',
      statusCode: 500
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
