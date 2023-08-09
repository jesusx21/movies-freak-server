import { expect } from 'chai';

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

    expect(result.items).to.have.lengthOf(5);
    expect(result.totalItems).to.be.equal(5);
    expect(result.skip).to.be.equal(0);
    expect(result.limit).to.be.equal(25);
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

    expect(result.items).to.have.lengthOf(3);
    expect(result.totalItems).to.be.equal(5);
    expect(result.skip).to.be.equal(2);
    expect(result.limit).to.be.equal(25);

    expect(result.items[0].name).to.be.equal('Star Wars: Clone Wars');
    expect(result.items[1].name).to.be.equal('Star Wars: Rebels');
    expect(result.items[2].name).to.be.equal('Friends');
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

    expect(result.items).to.have.lengthOf(3);
    expect(result.totalItems).to.be.equal(5);
    expect(result.skip).to.be.equal(0);
    expect(result.limit).to.be.equal(3);

    expect(result.items[0].name).to.be.equal('How I Met Your Mother');
    expect(result.items[1].name).to.be.equal('How I Met Your Father');
    expect(result.items[2].name).to.be.equal('Star Wars: Clone Wars');
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

    expect(result.items).to.have.lengthOf(2);
    expect(result.totalItems).to.be.equal(5);
    expect(result.skip).to.be.equal(1);
    expect(result.limit).to.be.equal(2);

    expect(result.items[0].name).to.be.equal('How I Met Your Father');
    expect(result.items[1].name).to.be.equal('Star Wars: Clone Wars');
  }

  async testGetEmptyListWhenThereIsNotTVSeries() {
    const result = await this.simulateGet({
      path: '/tv-series'
    });

    expect(result.items).to.empty;
    expect(result.totalItems).to.be.equal(0);
    expect(result.skip).to.be.equal(0);
    expect(result.limit).to.be.equal(25);
  }

  async testReturnErrorHandlerOnUnexpectedError() {
    this.stubFunction(this._database.tvSeries, 'find')
      .throws(new Error());

    const result = await this.simulateGet({
      path: '/tv-series',
      statusCode: 500
    });

    expect(result.code).to.be.equal('UNEXPECTED_ERROR');
  }
}
