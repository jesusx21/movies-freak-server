import { expect } from 'chai';

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

    expect(result.id).to.exist;
    expect(result.imdbId).to.be.equal('tt0460649');
    expect(result.name).to.be.equal('How I Met Your Mother');
    expect(result.plot).to.be.equal(
      'A father recounts to his children - through a series of flashbacks - '
      + 'the journey he and his four best friends took leading up to him meeting their mother.'
    );
    expect(result.years).to.be.deep.equal({ from: '2005', to: '2014' });
    expect(result.rated).to.be.equal('TV-14');
    expect(result.genre).to.be.deep.equal(['Comedy', 'Drama', 'Romance']);
    expect(result.writers).to.be.deep.equal(['Carter Bays', 'Craig Thomas']);
    expect(result.actors).to.be.deep.equal(['Josh Radnor', 'Jason Segel', 'Cobie Smulders']);
    expect(result.poster).to.be.equal(
      'https://m.media-amazon.com/images/M/MV5BNjg1MDQ5MjQ2N15BMl5'
      + 'BanBnXkFtZTYwNjI5NjA3._V1_SX300.jpg'
    );
    expect(result.imdbRating).to.be.equal('8.3/10');
    expect(result.totalSeasons).to.be.equal(9);
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

    expect(result.code).to.be.equal('UNEXPECTED_ERROR');
  }
}
