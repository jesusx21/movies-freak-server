import CreateTVSerie from '../../../../app/moviesFreak/createTVSerie';

import APITestCase from '../../apiTestHelper';

export default class CreateTVSerieTest extends APITestCase {
  setUp() {
    super.setUp();

    const database = this.getDatabase();

    this.buildTestApp(database);
  }

  async testCreateTvSerie() {
    const result = await this.simulatePost({
      path: '/tv-series',
      payload: { imdbId: 'fakeImdbId' }
    });

    this.assertThat(result.id).doesExist();
    this.assertThat(result.imdbId).isEqual('tt0460649');
    this.assertThat(result.name).isEqual('How I Met Your Mother');
    this.assertThat(result.plot).isEqual(
      'A father recounts to his children - through a series of flashbacks - '
      + 'the journey he and his four best friends took leading up to him meeting their mother.'
    );
    this.assertThat(result.years).isEqual({ from: '2005', to: '2014' });
    this.assertThat(result.rated).isEqual('TV-14');
    this.assertThat(result.genre).isEqual(['Comedy', 'Drama', 'Romance']);
    this.assertThat(result.writers).isEqual(['Carter Bays', 'Craig Thomas']);
    this.assertThat(result.actors).isEqual(['Josh Radnor', 'Jason Segel', 'Cobie Smulders']);
    this.assertThat(result.poster).isEqual(
      'https://m.media-amazon.com/images/M/MV5BNjg1MDQ5MjQ2N15BMl5'
      + 'BanBnXkFtZTYwNjI5NjA3._V1_SX300.jpg'
    );
    this.assertThat(result.imdbRating).isEqual('8.3/10');
    this.assertThat(result.totalSeasons).isEqual(9);
  }

  async testReturnHandledErrorOnUnexpectedError() {
    this.mockClass(CreateTVSerie, 'instance')
      .expects('execute')
      .throws(new Error('database fails'));

    const result = await this.simulatePost({
      path: '/tv-series',
      payload: { imdbId: 'fakeImdbId' },
      statusCode: 500
    });

    this.assertThat(result.code).isEqual('UNEXPECTED_ERROR');
  }
}
