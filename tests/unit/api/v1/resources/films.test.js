import Presenters from '../../../../../api/v1/presenters';
import FilmResource from '../../../../../api/v1/resources/films';
import DummyGateway from '../../../../../app/imdb/dummyGateway';
import { HTTPInternalError } from '../../../../../api/httpResponses';

describe('API - V1 - Resources', () => {
  describe('Films', () => {
    let database;
    let filmResource;

    beforeEach(() => {
      testHelper.createSandbox();

      database = testHelper.getDatabase();
      const imdb = new DummyGateway();
      const presenter = new Presenters();
      filmResource = new FilmResource(database, imdb, presenter);
    });

    afterEach(() => {
      testHelper.restoreSandbox();
    });

    describe('#onPost', () => {
      let body;

      beforeEach(() => {
        body = {
          imdbId: 'tt0111161'
        };
      });

      it('should create film', async () => {
        const { status, data } = await filmResource.onPost({ body });

        expect(status).to.be.equal(201);
        expect(data.id).to.exist;
        expect(data.name).to.be.equal('The Shawshank Redemption');
        expect(data.plot).to.be.equal(
          'Over the course of several years, two convicts form a friendship, '
          + 'seeking consolation and, eventually, redemption through basic compassion.'
        );
        expect(data.title).to.be.equal('The Shawshank Redemption');
        expect(data.year).to.be.equal('1994');
        expect(data.rated).to.be.equal('R');
        expect(data.runtime).to.be.equal('142 min');
        expect(data.director).to.be.equal('Frank Darabont');
        expect(data.poster).to.be.equal(
          'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZ'
          + 'DViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
        );
        expect(data.production).to.be.equal('N/A');
        expect(data.genre).to.be.deep.equal(['Drama']);
        expect(data.writers).to.be.deep.equal(['Stephen King', 'Frank Darabont']);
        expect(data.actors).to.be.deep.equal(['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']);
        expect(data.imdbId).to.be.equal('tt0111161');
        expect(data.imdbRating).to.be.equal('9.3/10');
      });

      it('should throw http error on unexpected error', async () => {
        testHelper.stubFunction(database.films, 'create')
          .throws(new Error());

        await expect(
          filmResource.onPost({ body })
        ).to.be.rejectedWith(HTTPInternalError);
      });
    });
  });
});
