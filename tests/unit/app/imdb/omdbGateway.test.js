import axios from 'axios';

import IMDB_FILM_RESPONSE from '../../data/imdbFilmResponse';
import IMDB_TV_SERIE_RESPONSE from '../../data/imdbTVSerieResponse';

import OMDBGateway from '../../../../app/imdb/omdbGateway';
import OMDBResult from '../../../../app/imdb/omdbResult';
import { IMDBError } from '../../../../app/imdb/errors';

describe('IMDB', () => {
  describe('OMDB Gateway', () => {
    let gateway;

    beforeEach(() => {
      gateway = new OMDBGateway();

      testHelper.createSandbox();
    });

    afterEach(() => {
      testHelper.restoreSandbox();
    });

    it('should request for a film by imdb id', async () => {
      testHelper.mockClass(axios)
        .expects('get')
        .resolves(IMDB_FILM_RESPONSE);

      const result = await gateway.fetchFilmById('tt0111161');
      const { data } = IMDB_FILM_RESPONSE;

      expect(result).to.be.instanceOf(OMDBResult);
      expect(result.isRequestSuccesful()).to.be.true;
      expect(result._isCollection()).to.be.false;
      expect(result.title).to.be.equal(data.Title);
      expect(result.year).to.be.equal(data.Year);
      expect(result.rated).to.be.equal(data.Rated);
      expect(result.released).to.be.equal(data.Released);
      expect(result.runtime).to.be.equal(data.Runtime);
      expect(result.genre).to.be.deep.equal(data.Genre.split(','));
      expect(result.director).to.be.equal(data.Director);
      expect(result.writers).to.be.deep.equal(['Stephen King', 'Frank Darabont']);
      expect(result.actors).to.be.deep.equal(
        ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']
      );
      expect(result.plot).to.be.equal(data.Plot);
      expect(result.language).to.be.equal(data.Language);
      expect(result.country).to.be.equal(data.Country);
      expect(result.awards).to.be.equal(data.Awards);
      expect(result.poster).to.be.equal(data.Poster);
      expect(result.ratings[0].source).to.be.equal(data.Ratings[0].Source);
      expect(result.ratings[0].value).to.be.equal(data.Ratings[0].Value);
      expect(result.ratings[1].source).to.be.equal(data.Ratings[1].Source);
      expect(result.ratings[1].value).to.be.equal(data.Ratings[1].Value);
      expect(result.ratings[2].source).to.be.equal(data.Ratings[2].Source);
      expect(result.ratings[2].value).to.be.equal(data.Ratings[2].Value);
      expect(result.imdbId).to.be.equal(data.imdbID);
      expect(result.type).to.be.equal(data.Type);
      expect(result.production).to.be.equal(data.Production);
    });

    it('should request for a film by imdb id', async () => {
      testHelper.mockClass(axios)
        .expects('get')
        .resolves(IMDB_TV_SERIE_RESPONSE);

      const result = await gateway.fetchFilmById('tt0212671');
      const { data } = IMDB_TV_SERIE_RESPONSE;

      expect(result).to.be.instanceOf(OMDBResult);
      expect(result.isRequestSuccesful()).to.be.true;
      expect(result._isCollection()).to.be.false;
      expect(result.title).to.be.equal(data.Title);
      expect(result.years).to.be.deep.equal({ from: '2000', to: '2006' });
      expect(result.rated).to.be.equal(data.Rated);
      expect(result.released).to.be.equal(data.Released);
      expect(result.runtime).to.be.equal(data.Runtime);
      expect(result.genre).to.be.deep.equal(['Comedy', 'Family']);
      expect(result.director).to.be.equal(data.Director);
      expect(result.writers).to.be.deep.equal(
        ['Linwood Boomer', 'Michael Glouberman', 'Gary Murphy']
      );
      expect(result.actors).to.be.deep.equal(
        ['Frankie Muniz', 'Bryan Cranston', 'Justin Berfield']
      );
      expect(result.plot).to.be.equal(data.Plot);
      expect(result.language).to.be.equal(data.Language);
      expect(result.country).to.be.equal(data.Country);
      expect(result.awards).to.be.equal(data.Awards);
      expect(result.poster).to.be.equal(data.Poster);
      expect(result.ratings[0].source).to.be.equal(data.Ratings[0].Source);
      expect(result.ratings[0].value).to.be.equal(data.Ratings[0].Value);
      expect(result.imdbId).to.be.equal(data.imdbID);
      expect(result.type).to.be.equal(data.Type);
      expect(result.production).to.be.equal(data.Production);
    });

    it('should thrown erorr on incorrect imdb id', async () => {
      testHelper.mockClass(axios)
        .expects('get')
        .resolves({ data: { Response: 'False', Error: 'Incorrect IMDb ID.' } });

      const error = await expect(
        gateway.fetchFilmById('tt0111161')
      ).to.be.rejectedWith(IMDBError);

      expect(error.message).to.be.equal('Incorrect IMDb ID.');
    });

    it('should thrown erorr on invalid api key', async () => {
      const data = { Response: 'False', Error: 'Invalid API key!' };

      testHelper.mockClass(axios)
        .expects('get')
        .rejects({ response: { data } });

      const error = await expect(
        gateway.fetchFilmById('tt011161')
      ).to.be.rejectedWith(IMDBError);

      expect(error.message).to.be.equal('Invalid API key!');
    });
  });
});
