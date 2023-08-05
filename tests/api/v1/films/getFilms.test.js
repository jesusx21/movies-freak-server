describe('API - v1', () => {
  describe('Get Films', () => {
    let database;

    beforeEach(() => {
      database = apiTestHelper.getDatabase();
      apiTestHelper.buildTestApp(database);

      apiTestHelper.createSandbox();
    });

    afterEach(() => {
      apiTestHelper.restoreSandbox();
    });

    it('should get films', async () => {
      await databaseTestHelper.createFilms(database, 5);

      const result = await apiTestHelper.simulateGet({
        path: '/films'
      });

      expect(result.items).to.have.lengthOf(5);
      expect(result.totalItems).to.be.equal(5);
      expect(result.skip).to.be.equal(0);
      expect(result.limit).to.be.equal(25);
    });

    it('should get films with skip', async () => {
      await databaseTestHelper.createFilms(
        database,
        [
          { name: 'Midsomar' },
          { name: 'Nimona' },
          { name: '10 Things I Hate about You' },
          { name: 'The Perks of Being a Wallflower' },
          { name: 'Predestination' }
        ]
      );

      const result = await apiTestHelper.simulateGet({
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
    });

    it('should get films with limit', async () => {
      await databaseTestHelper.createFilms(
        database,
        [
          { name: 'Midsomar' },
          { name: 'Nimona' },
          { name: '10 Things I Hate about You' },
          { name: 'The Perks of Being a Wallflower' },
          { name: 'Predestination' }
        ]
      );

      const result = await apiTestHelper.simulateGet({
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
    });

    it('should get films with skip and limit', async () => {
      await databaseTestHelper.createFilms(
        database,
        [
          { name: 'Midsomar' },
          { name: 'Nimona' },
          { name: '10 Things I Hate about You' },
          { name: 'The Perks of Being a Wallflower' },
          { name: 'Predestination' }
        ]
      );

      const result = await apiTestHelper.simulateGet({
        path: '/films',
        query: { skip: 1, limit: 2 }
      });

      expect(result.items).to.have.lengthOf(2);
      expect(result.totalItems).to.be.equal(5);
      expect(result.skip).to.be.equal(1);
      expect(result.limit).to.be.equal(2);

      expect(result.items[0].name).to.be.equal('Nimona');
      expect(result.items[1].name).to.be.equal('10 Things I Hate about You');
    });

    it('should return empty when there is no films', async () => {
      const result = await apiTestHelper.simulateGet({
        path: '/films'
      });

      expect(result.items).to.empty;
      expect(result.totalItems).to.be.equal(0);
      expect(result.skip).to.be.equal(0);
      expect(result.limit).to.be.equal(25);
    });

    it('should return handled error on unexpected error', async () => {
      apiTestHelper.stubFunction(database.films, 'find')
        .throws(new Error());

      const result = await apiTestHelper.simulateGet({
        path: '/films',
        statusCode: 500
      });

      expect(result.code).to.be.equal('UNEXPECTED_ERROR');
    });
  });
});
