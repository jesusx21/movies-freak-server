describe('API - v1', () => {
  describe('Get TV Series', () => {
    let database;

    beforeEach(() => {
      database = apiTestHelper.getDatabase();
      apiTestHelper.buildTestApp(database);

      apiTestHelper.createSandbox();
    });

    afterEach(() => {
      apiTestHelper.restoreSandbox();
    });

    it('should get tv series', async () => {
      await databaseTestHelper.createTVSeries(database, 5);

      const result = await apiTestHelper.simulateGet({
        path: '/tv-series'
      });

      expect(result.items).to.have.lengthOf(5);
      expect(result.totalItems).to.be.equal(5);
      expect(result.skip).to.be.equal(0);
      expect(result.limit).to.be.equal(25);
    });

    it('should get tv series with skip', async () => {
      await databaseTestHelper.createTVSeries(
        database,
        [
          { name: 'How I Met Your Mother' },
          { name: 'How I Met Your Father' },
          { name: 'Star Wars: Clone Wars' },
          { name: 'Star Wars: Rebels' },
          { name: 'Friends' }
        ]
      );

      const result = await apiTestHelper.simulateGet({
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
    });

    it('should get tv series with limit', async () => {
      await databaseTestHelper.createTVSeries(
        database,
        [
          { name: 'How I Met Your Mother' },
          { name: 'How I Met Your Father' },
          { name: 'Star Wars: Clone Wars' },
          { name: 'Star Wars: Rebels' },
          { name: 'Friends' }
        ]
      );

      const result = await apiTestHelper.simulateGet({
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
    });

    it('should get tv series with skip and limit', async () => {
      await databaseTestHelper.createTVSeries(
        database,
        [
          { name: 'How I Met Your Mother' },
          { name: 'How I Met Your Father' },
          { name: 'Star Wars: Clone Wars' },
          { name: 'Star Wars: Rebels' },
          { name: 'Friends' }
        ]
      );

      const result = await apiTestHelper.simulateGet({
        path: '/tv-series',
        query: { skip: 1, limit: 2 }
      });

      expect(result.items).to.have.lengthOf(2);
      expect(result.totalItems).to.be.equal(5);
      expect(result.skip).to.be.equal(1);
      expect(result.limit).to.be.equal(2);

      expect(result.items[0].name).to.be.equal('How I Met Your Father');
      expect(result.items[1].name).to.be.equal('Star Wars: Clone Wars');
    });

    it('should return empty when there is no tv series', async () => {
      const result = await apiTestHelper.simulateGet({
        path: '/tv-series'
      });

      expect(result.items).to.empty;
      expect(result.totalItems).to.be.equal(0);
      expect(result.skip).to.be.equal(0);
      expect(result.limit).to.be.equal(25);
    });

    it('should return handled error on unexpected error', async () => {
      apiTestHelper.stubFunction(database.tvSeries, 'find')
        .throws(new Error());

      const result = await apiTestHelper.simulateGet({
        path: '/tv-series',
        statusCode: 500
      });

      expect(result.code).to.be.equal('UNEXPECTED_ERROR');
    });
  });
});
