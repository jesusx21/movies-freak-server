import CreateTVSerie from '../../../../app/moviesFreak/createTVSerie';

describe('API - v1', () => {
  describe('Create TV Serie', () => {
    beforeEach(() => {
      const database = apiTestHelper.getDatabase();
      apiTestHelper.buildTestApp(database);

      apiTestHelper.createSandbox();
    });

    afterEach(() => {
      apiTestHelper.restoreSandbox();
    });

    it('should create tv serie', async () => {
      const result = await apiTestHelper.simulatePost({
        path: '/tv-series',
        payload: { imdbId: 'fakeImdbId' }
      });

      expect(result.id).to.exist;
      expect(result.imdbId).to.be.equal('tt0111161');
      expect(result.name).to.be.equal('The Shawshank Redemption');
      expect(result.plot).to.be.equal(
        'Over the course of several years, two convicts form a friendship, '
        + 'seeking consolation and, eventually, redemption through basic compassion.'
      );
      expect(result.years).to.be.deep.equal({ from: '1994', to: '1995' });
      expect(result.rated).to.be.equal('R');
      expect(result.genre).to.be.deep.equal(['Drama']);
      expect(result.writers).to.be.deep.equal(['Stephen King', 'Frank Darabont']);
      expect(result.actors).to.be.deep.equal(['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']);
      expect(result.poster).to.be.equal(
        'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZ'
        + 'DViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
      );
      expect(result.imdbRating).to.be.equal('9.3/10');
      expect(result.totalSeasons).to.be.equal(10);
    });

    it('should raise error when use case throws an error', async () => {
      apiTestHelper.mockClass(CreateTVSerie, 'instance')
        .expects('execute')
        .throws(new Error('database fails'));

      const result = await apiTestHelper.simulatePost({
        path: '/tv-series',
        payload: { imdbId: 'fakeImdbId' },
        statusCode: 500
      });

      expect(result.code).to.be.equal('UNEXPECTED_ERROR');
    });
  });
});