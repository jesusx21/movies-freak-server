import DummyGateway from '../../../../app/imdb/dummyGateway';
import OMDBResult from '../../../../app/imdb/omdbResult';
import CreateTVSerie from '../../../../app/moviesFreak/createTVSerie';
import { TVSerie } from '../../../../app/moviesFreak/entities';
import { CouldNotCreateTVSerie } from '../../../../app/moviesFreak/errors';

import IMDB_TV_SERIE_RESPONSE from '../../data/imdbTVSerieResponse';

const IMDB_ID = 'tt0212671';

describe('Movies Freak', () => {
  describe('Create TV Serie', () => {
    let useCase;

    beforeEach(() => {
      testHelper.createSandbox();

      const database = testHelper.getDatabase();
      const imdb = new DummyGateway();

      useCase = new CreateTVSerie(database, imdb, IMDB_ID);
    });

    afterEach(() => testHelper.restoreSandbox());

    it('sould create a tv serie', async () => {
      const omdbResult = new OMDBResult(IMDB_TV_SERIE_RESPONSE.data);

      testHelper.stubFunction(useCase._imdb, 'fetchTVSerieById')
        .resolves(omdbResult);

      const tvSerie = await useCase.execute();

      expect(tvSerie).to.be.instanceOf(TVSerie);
      expect(tvSerie.id).to.exist;
      expect(tvSerie.imdbId).to.be.equal('tt0212671');
      expect(tvSerie.name).to.be.equal('Malcolm in the Middle');
      expect(tvSerie.plot).to.be.equal(
        'A gifted young teen tries to survive life with his dimwitted, dysfunctional family.'
      );
      expect(tvSerie.years).to.be.deep.equal({ from: '2000', to: '2006' });
      expect(tvSerie.rated).to.be.equal('TV-PG');
      expect(tvSerie.genre).to.be.deep.equal(['Comedy', 'Family']);
      expect(tvSerie.writers).to.be.deep.equal(
        ['Linwood Boomer', 'Michael Glouberman', 'Gary Murphy']
      );
      expect(tvSerie.actors).to.be.deep.equal(
        ['Frankie Muniz', 'Bryan Cranston', 'Justin Berfield']
      );
      expect(tvSerie.poster).to.be.equal(
        'https://m.media-amazon.com/images/M/MV5BNTc2MzM2N2YtZDdiOS00M2'
        + 'I2LWFjOGItMDM3OTA3YjUwNjAxXkEyXkFqcGdeQXVyNzA5NjUyNjM@._V1_SX300.jpg'
      );
      expect(tvSerie.imdbRating).to.be.equal('8.2/10');
      expect(tvSerie.totalSeasons).to.be.equal('7');
      expect(tvSerie.releasedAt).to.be.instanceOf(Date);
    });

    it('should thrown error when imdb requet fails', async () => {
      testHelper.stubFunction(useCase._imdb, 'fetchTVSerieById')
        .throws(new Error());

      await expect(
        useCase.execute()
      ).to.be.rejectedWith(CouldNotCreateTVSerie);
    });

    it('should thrown error when database fails', async () => {
      testHelper.stubFunction(useCase._database.tvSeries, 'create')
        .throws(new Error());

      await expect(
        useCase.execute()
      ).to.be.rejectedWith(CouldNotCreateTVSerie);
    });
  });
});
