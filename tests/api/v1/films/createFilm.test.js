import APITestCase from '../../apiTestHelper.js';
import CreateFilm from '../../../../app/moviesFreak/createFilm.js';

export default class CreateFilmTest extends APITestCase {
  setUp() {
    super.setUp();

    this._database = this.getDatabase();
    this.buildTestApp(this._database);
  }

  async testCreateFilm() {
    const result = await this.simulatePost({
      path: '/films',
      payload: { imdbId: 'fakeImdbId' }
    });

    this.assertThat(result.id).doesExist();
    this.assertThat(result.name).isEqual('The Shawshank Redemption');
    this.assertThat(result.plot).isEqual(
      'Over the course of several years, two convicts form a friendship, '
      + 'seeking consolation and, eventually, redemption through basic compassion.'
    );
    this.assertThat(result.title).isEqual('The Shawshank Redemption');
    this.assertThat(result.year).isEqual('1994');
    this.assertThat(result.rated).isEqual('R');
    this.assertThat(result.runtime).isEqual('142 min');
    this.assertThat(result.director).isEqual('Frank Darabont');
    this.assertThat(result.poster).isEqual(
      'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZ'
      + 'DViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
    );
    this.assertThat(result.production).isEqual('N/A');
    this.assertThat(result.genre).isEqual(['Drama']);
    this.assertThat(result.writers).isEqual(['Stephen King', 'Frank Darabont']);
    this.assertThat(result.actors).isEqual(['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']);
    this.assertThat(result.imdbId).isEqual('tt0111161');
    this.assertThat(result.imdbRating).isEqual('9.3/10');
  }

  async testReturnsErrorOnUnexpectedError() {
    this.mockClass(CreateFilm, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulatePost({
      path: '/films',
      payload: { imdbId: 'fakeImdbId' },
      statusCode: 500
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
