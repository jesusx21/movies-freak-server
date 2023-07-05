import Presenters from '../../../../../api/v1/presenters';
import FilmResource from '../../../../../api/v1/resources/films';
import { HTTPInternalError } from '../../../../../api/httpResponses';

describe('API - V1 - Resources', () => {
  describe('Films', () => {
    let database;
    let filmResource;

    beforeEach(() => {
      testHelper.createSandbox();

      database = testHelper.getDatabase();
      const presenter = new Presenters();
      filmResource = new FilmResource(database, presenter);
    });

    afterEach(() => {
      testHelper.restoreSandbox();
    });

    describe('#onPost', () => {
      let body;

      beforeEach(() => {
        body = {
          name: 'Harry Potter',
          plot: 'Yer a wizard',
          title: 'Harry Potter and The Sorcerer Stone',
          year: '2001',
          rated: 'pg-13',
          runtime: '2 horas y media',
          director: 'No me acuerdo',
          poster: 'www.film.com/poster',
          production: 'Warner Bros',
          genre: ['coming out of age', 'adventure', 'fiction'],
          writer: ['I dunno'],
          actors: ['Daniel', 'Emma', 'Rupert'],
          imdbId: '45s4d7fsd',
          imdbRating: '10 out of 10'
        };
      });

      it('should create film', async () => {
        const { status, data } = await filmResource.onPost({ body });
        
        expect(status).to.be.equal(201);
        expect(data.id).to.exist;
        expect(data.name).to.be.equal(body.name);
        expect(data.plot).to.be.equal(body.plot);
        expect(data.title).to.be.equal(body.title);
        expect(data.year).to.be.equal(body.year);
        expect(data.rated).to.be.equal(body.rated);
        expect(data.runtime).to.be.equal(body.runtime);
        expect(data.director).to.be.equal(body.director);
        expect(data.poster).to.be.equal(body.poster);
        expect(data.production).to.be.equal(body.production);
        expect(data.genre).to.be.deep.equal(body.genre);
        expect(data.writer).to.be.deep.equal(body.writer);
        expect(data.actors).to.be.deep.equal(body.actors);
        expect(data.imdbId).to.be.equal(body.imdbId);
        expect(data.imdbRating).to.be.equal(body.imdbRating);
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