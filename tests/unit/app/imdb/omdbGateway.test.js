import axios from 'axios';

import OMDBGateway from '../../../../app/imdb/omdbGateway';
import OMDBResult from '../../../../app/imdb/omdbResult';
import { IMDBError } from '../../../../app/imdb/errors';

const FAKE_RESPONSE = {
  data: {
    Title: 'The Shawshank Redemption',
    Year: '1994',
    Rated: 'R',
    Released: '14 Oct 1994',
    Runtime: '142 min',
    Genre: 'Drama',
    Director: 'Frank Darabont',
    Writer: 'Stephen King, Frank Darabont',
    Actors: 'Tim Robbins, Morgan Freeman, Bob Gunton',
    Plot: 'Over the course of several years, two convicts form a friendship, '
      + 'seeking consolation and, eventually, redemption through basic compassion.',
    Language: 'English',
    Country: 'United States',
    Awards: 'Nominated for 7 Oscars. 21 wins & 42 nominations total',
    Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJ'
      + 'iNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
    Ratings: [
      { Source: 'Internet Movie Database', Value: '9.3/10' },
      { Source: 'Rotten Tomatoes', Value: '91%' },
      { Source: 'Metacritic', Value: '82/100' }
    ],
    Metascore: '82',
    imdbRating: '9.3',
    imdbVotes: '2,757,076',
    imdbID: 'tt0111161',
    Type: 'movie',
    DVD: '21 Dec 1999',
    BoxOffice: '$28,767,189',
    Production: 'N/A',
    Website: 'N/A',
    Response: 'True'
  }
};

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
        .resolves(FAKE_RESPONSE);

      const result = await gateway.fetchFilmById('tt0111161');

      expect(result).to.be.instanceOf(OMDBResult);
      expect(result.isRequestSuccesful()).to.be.true;
      expect(result._isCollection()).to.be.false;
      expect(result.title).to.be.equal(FAKE_RESPONSE.data.Title);
      expect(result.year).to.be.equal(FAKE_RESPONSE.data.Year);
      expect(result.rated).to.be.equal(FAKE_RESPONSE.data.Rated);
      expect(result.released).to.be.equal(FAKE_RESPONSE.data.Released);
      expect(result.runtime).to.be.equal(FAKE_RESPONSE.data.Runtime);
      expect(result.genre).to.be.deep.equal(FAKE_RESPONSE.data.Genre.split(','));
      expect(result.director).to.be.equal(FAKE_RESPONSE.data.Director);
      expect(result.writers).to.be.deep.equal(FAKE_RESPONSE.data.Writer.split(','));
      expect(result.actors).to.be.deep.equal(FAKE_RESPONSE.data.Actors.split(','));
      expect(result.plot).to.be.equal(FAKE_RESPONSE.data.Plot);
      expect(result.language).to.be.equal(FAKE_RESPONSE.data.Language);
      expect(result.country).to.be.equal(FAKE_RESPONSE.data.Country);
      expect(result.awards).to.be.equal(FAKE_RESPONSE.data.Awards);
      expect(result.poster).to.be.equal(FAKE_RESPONSE.data.Poster);
      expect(result.ratings[0].source).to.be.equal(FAKE_RESPONSE.data.Ratings[0].Source);
      expect(result.ratings[0].value).to.be.equal(FAKE_RESPONSE.data.Ratings[0].Value);
      expect(result.ratings[1].source).to.be.equal(FAKE_RESPONSE.data.Ratings[1].Source);
      expect(result.ratings[1].value).to.be.equal(FAKE_RESPONSE.data.Ratings[1].Value);
      expect(result.ratings[2].source).to.be.equal(FAKE_RESPONSE.data.Ratings[2].Source);
      expect(result.ratings[2].value).to.be.equal(FAKE_RESPONSE.data.Ratings[2].Value);
      expect(result.imdbId).to.be.equal(FAKE_RESPONSE.data.imdbID);
      expect(result.type).to.be.equal(FAKE_RESPONSE.data.Type);
      expect(result.production).to.be.equal(FAKE_RESPONSE.data.Production);
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
