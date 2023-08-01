import CreateFilm from '../../../../app/moviesFreak/createFilm';

describe('API - v1', () => {
  describe('Create Film', () => {
    let database;

    beforeEach(() => {
      database = apiTestHelper.getDatabase();
      apiTestHelper.buildTestApp(database);

      apiTestHelper.createSandbox();
    });

    afterEach(() => {
      apiTestHelper.restoreSandbox();
    });

    it('should create film', async () => {
      const result = await apiTestHelper.simulatePost({
        path: '/films',
        payload: { imdbId: 'fakeImdbId' }
      });

      expect(result.id).to.exist;
      expect(result.name).to.be.equal('The Shawshank Redemption');
      expect(result.plot).to.be.equal(
        'Over the course of several years, two convicts form a friendship, '
        + 'seeking consolation and, eventually, redemption through basic compassion.'
      );
      expect(result.title).to.be.equal('The Shawshank Redemption');
      expect(result.year).to.be.equal('1994');
      expect(result.rated).to.be.equal('R');
      expect(result.runtime).to.be.equal('142 min');
      expect(result.director).to.be.equal('Frank Darabont');
      expect(result.poster).to.be.equal(
        'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZ'
        + 'DViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
      );
      expect(result.production).to.be.equal('N/A');
      expect(result.genre).to.be.deep.equal(['Drama']);
      expect(result.writers).to.be.deep.equal(['Stephen King', 'Frank Darabont']);
      expect(result.actors).to.be.deep.equal(['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']);
      expect(result.imdbId).to.be.equal('tt0111161');
      expect(result.imdbRating).to.be.equal('9.3/10');
    });

    it('should raise error when use case throws an error', async () => {
      apiTestHelper.mockClass(CreateFilm, 'instance')
        .expects('execute')
        .throws(new Error('database fails'));

      const result = await apiTestHelper.simulatePost({
        path: '/films',
        payload: { imdbId: 'fakeImdbId' },
        statusCode: 500
      });

      expect(result.code).to.be.equal('UNEXPECTED_ERROR');
    });
  });
});
