import { expect } from 'chai';

import APITestCase from '../../apiTestHelper';

export default class GetFilmsTest extends APITestCase {
  setUp() {
    super.setUp();

    this._database = this.getDatabase();
    this.buildTestApp(this._database);
  }

  async testGetFilms() {
    await this.createFilms(this._database, 5);

    const result = await this.simulateGet({
      path: '/films'
    });

    expect(result.items).to.have.lengthOf(5);
    expect(result.totalItems).to.be.equal(5);
    expect(result.skip).to.be.equal(0);
    expect(result.limit).to.be.equal(25);
  }

  async testGetFilmsWithSkip() {
    await this.createFilms(
      this._database,
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const result = await this.simulateGet({
      path: '/films',
      query: { skip: 2 }
    });

    expect(result.items).to.have.lengthOf(3);
    expect(result.totalItems).to.be.equal(5);
    expect(result.skip).to.be.equal(2);
    expect(result.limit).to.be.equal(25);

    expect(result.items[0].name).to.be.equal('10 Things I Hate about You');
    expect(result.items[1].name).to.be.equal('The Perks of Being a Wallflower');
    expect(result.items[2].name).to.be.equal('Predestination');
  }

  async testGetFilmsWithLimit() {
    await this.createFilms(
      this._database,
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const result = await this.simulateGet({
      path: '/films',
      query: { limit: 3 }
    });

    expect(result.items).to.have.lengthOf(3);
    expect(result.totalItems).to.be.equal(5);
    expect(result.skip).to.be.equal(0);
    expect(result.limit).to.be.equal(3);

    expect(result.items[0].name).to.be.equal('Midsomar');
    expect(result.items[1].name).to.be.equal('Nimona');
    expect(result.items[2].name).to.be.equal('10 Things I Hate about You');
  }

  async testGetFilmsWithSkipAndLimit() {
    await this.createFilms(
      this._database,
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const result = await this.simulateGet({
      path: '/films',
      query: { skip: 1, limit: 2 }
    });

    expect(result.items).to.have.lengthOf(2);
    expect(result.totalItems).to.be.equal(5);
    expect(result.skip).to.be.equal(1);
    expect(result.limit).to.be.equal(2);

    expect(result.items[0].name).to.be.equal('Nimona');
    expect(result.items[1].name).to.be.equal('10 Things I Hate about You');
  }

  async testGetEmptyListWhenThereIsNotFilms() {
    const result = await this.simulateGet({
      path: '/films'
    });

    expect(result.items).to.empty;
    expect(result.totalItems).to.be.equal(0);
    expect(result.skip).to.be.equal(0);
    expect(result.limit).to.be.equal(25);
  }

  async testReturnErrorHandlerOnUnexpectedError() {
    this.stubFunction(this._database.films, 'find')
      .throws(new Error());

    const result = await this.simulateGet({
      path: '/films',
      statusCode: 500
    });

    expect(result.code).to.be.equal('UNEXPECTED_ERROR');
  }
}
