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

    this.assertThat(result.items).hasLengthOf(5);
    this.assertThat(result.totalItems).isEqual(5);
    this.assertThat(result.skip).isEqual(0);
    this.assertThat(result.limit).isEqual(25);
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

    this.assertThat(result.items).hasLengthOf(3);
    this.assertThat(result.totalItems).isEqual(5);
    this.assertThat(result.skip).isEqual(2);
    this.assertThat(result.limit).isEqual(25);

    this.assertThat(result.items[0].name).isEqual('10 Things I Hate about You');
    this.assertThat(result.items[1].name).isEqual('The Perks of Being a Wallflower');
    this.assertThat(result.items[2].name).isEqual('Predestination');
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

    this.assertThat(result.items).hasLengthOf(3);
    this.assertThat(result.totalItems).isEqual(5);
    this.assertThat(result.skip).isEqual(0);
    this.assertThat(result.limit).isEqual(3);

    this.assertThat(result.items[0].name).isEqual('Midsomar');
    this.assertThat(result.items[1].name).isEqual('Nimona');
    this.assertThat(result.items[2].name).isEqual('10 Things I Hate about You');
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

    this.assertThat(result.items).hasLengthOf(2);
    this.assertThat(result.totalItems).isEqual(5);
    this.assertThat(result.skip).isEqual(1);
    this.assertThat(result.limit).isEqual(2);

    this.assertThat(result.items[0].name).isEqual('Nimona');
    this.assertThat(result.items[1].name).isEqual('10 Things I Hate about You');
  }

  async testGetEmptyListWhenThereIsNotFilms() {
    const result = await this.simulateGet({
      path: '/films'
    });

    this.assertThat(result.items).isEmpty();
    this.assertThat(result.totalItems).isEqual(0);
    this.assertThat(result.skip).isEqual(0);
    this.assertThat(result.limit).isEqual(25);
  }

  async testReturnErrorHandlerOnUnexpectedError() {
    this.stubFunction(this._database.films, 'find')
      .throws(new Error());

    const result = await this.simulateGet({
      path: '/films',
      statusCode: 500
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
