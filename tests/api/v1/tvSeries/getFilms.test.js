import { expect } from 'chai';
import APITestHelper from '../../testHelper';

describe('API - v1', () => {
  describe('Get TV Series', () => {
    let testHelper;

    beforeEach(() => {
      testHelper = new APITestHelper();

      testHelper.createSandbox();
      testHelper.buildDatabase();
      testHelper.buildTestApp();
    });

    afterEach(async () => {
      testHelper.restoreSandbox();
      await testHelper.cleanDatabase();
    });

    it('should get tv series when there is only a record', async () => {
      await testHelper.createTVSerie({ name: 'Friends' });

      const { items, totalItems } = await testHelper.simulateGet({
        path: '/tv-series',
        statusCode: 200
      });

      expect(totalItems).to.be.equal(1);
      expect(items).to.have.lengthOf(1);
      expect(items[0].name).to.be.equal('Friends');
    });

    it('should get tv series when there is multiple records', async () => {
      await testHelper.createTVSeries({ quantity: 4 });

      const { items, totalItems } = await testHelper.simulateGet({
        path: '/tv-series',
        statusCode: 200
      });

      expect(totalItems).to.be.equal(4);
      expect(items).to.have.lengthOf(4);
    });

    it('should return empty list when there is no records', async () => {
      const { items, totalItems } = await testHelper.simulateGet({
        path: '/tv-series',
        statusCode: 200
      });

      expect(totalItems).to.be.equal(0);
      expect(items).to.be.empty;
    });

    // it('should raise error when database throw an error', async () => {
    //   testHelper.stubDatabaseFunction('films', 'find')
    //     .throws(new Error('database fails'));

    //   const result = await testHelper.simulateGet({
    //     path: '/films',
    //     statusCode: 200
    //   });

    //   expect(result.code).to.be.equal('UNEXPECTED_ERROR');
    // });
  });
});
