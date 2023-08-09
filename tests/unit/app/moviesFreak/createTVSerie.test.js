import { expect } from 'chai';

import TestCase from '../../../testHelper';
import IMDB_TV_SERIE_RESPONSE from '../../data/imdbTVSerieResponse';

import DummyGateway from '../../../../app/imdb/dummyGateway';
import OMDBResult from '../../../../app/imdb/omdbResult';
import CreateTVSerie from '../../../../app/moviesFreak/createTVSerie';
import { TVSerie } from '../../../../app/moviesFreak/entities';
import { CouldNotCreateTVSerie } from '../../../../app/moviesFreak/errors';

const IMDB_ID = 'tt0212671';

export default class CreateTVSerieTest extends TestCase {
  setUp() {
    super.setUp();

    const database = this.getDatabase();
    const imdb = new DummyGateway();

    this.useCase = new CreateTVSerie(database, imdb, IMDB_ID);
  }

  async testCreateTVSerie() {
    const omdbResult = new OMDBResult(IMDB_TV_SERIE_RESPONSE.data);

    this.stubFunction(this.useCase._imdb, 'fetchTVSerieById')
      .resolves(omdbResult);

    const tvSerie = await this.useCase.execute();

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
  }

  async testThrowErrorWhenIMDBFails() {
    this.stubFunction(this.useCase._imdb, 'fetchTVSerieById')
      .throws(new Error());

    await expect(
      this.useCase.execute()
    ).to.be.rejectedWith(CouldNotCreateTVSerie);
  }

  async testThrowErrorWhenDatabaseFails() {
    this.stubFunction(this.useCase._database.tvSeries, 'create')
      .throws(new Error());

    await expect(
      this.useCase.execute()
    ).to.be.rejectedWith(CouldNotCreateTVSerie);
  }
}
