import { HTTPInternalError } from '../../../../../api/httpResponses';
import FilmResource from '../../../../../api/v1/resources/films';

describe('API - V1 - Resources', () => {
  describe('Films', () => {
    let database;
    let filmResource;

    beforeEach(() => {
      testHelper.createSandbox();

      database = testHelper.getDatabase();
      filmResource = new FilmResource(database);
    });

    afterEach(() => {
      testHelper.restoreSandbox();
    });

    describe('#onPost', () => {
      let body;

      beforeEach(() => {
        body = {
          name: 'Harry Potter',
          plot: 'Yer a wizard'
        };
      });

      it('should create film', async () => {
        const { status, data } = await filmResource.onPost(body);
        
        expect(status).to.be.equal(201);
        expect(data.id).to.exist;
        expect(data.name).to.be.equal(body.name);
        expect(data.plot).to.be.equal(body.plot);
      });

      it('should throw http error on unexpected error', async () => {
        testHelper.stubFunction(database.films, 'create')
          .throws(new Error());

        await expect(
          filmResource.onPost(body)
        ).to.be.rejectedWith(HTTPInternalError);
      });
    });
  });
});