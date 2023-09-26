import APITestCase from '../../apiTestHelper';

export default class GetFilmById extends APITestCase {
  async setUp() {
    super.setUp();

    this._database = this.getDatabase();

    this.buildTestApp(this._database);

    this.films = await this.createFilms(this._database, 5);
  }

  tearDown() {
    this.restoreSandbox();
  }

  async testFindById() {
    const result = await this.simulateGet({
      path: `/films/${this.films[2].id}`
    });

    this.assertThat(result.id).isEqual(this.films[2].id);
    this.assertThat(result.name).isEqual(this.films[2].name);
  }

  async testReturnsNotFoundErorOnUnexistentFilm() {
    const result = await this.simulateGet({
      path: `/films/${this.generateUUID()}`,
      statusCode: 404
    });

    this.assertThat(result.code).isEqual('FILM_NOT_FOUND');
  }

  async testReturnsUnexpectedErrorOnServerError() {
    this.mockFunction(this._database.films, 'findById')
      .throws(new Error());

    this.buildTestApp(this._database);

    const result = await this.simulateGet({
      path: `/films/${this.films[2].id}`,
      statusCode: 500
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
