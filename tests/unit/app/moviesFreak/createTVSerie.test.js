import TestCase from '../../../testHelper';
import IMDB_TV_EPISODE_RESPONSE from '../../data/imdbTVEpisodeResponse';
import IMDB_TV_SERIE_RESPONSE from '../../data/imdbTVSerieResponse';
import IMDB_TV_SEASON_RESPONSE from '../../data/imdbTVSeasonResponse';

import CreateTVSerie from '../../../../app/moviesFreak/createTVSerie';
import DummyGateway from '../../../../app/imdb/gateways/dummy/dummyGateway';
import { CouldNotCreateTVSeasons, CouldNotCreateTVSerie } from '../../../../app/moviesFreak/errors';
import { TVSerie } from '../../../../app/moviesFreak/entities';
import {
  OMDBTVEpisodeResult,
  OMDBTVSeasonResult,
  OMDBTVSerieResult
} from '../../../../app/imdb/gateways/omdb/result';

const IMDB_ID = 'tt0212671';

export default class CreateTVSerieTest extends TestCase {
  setUp() {
    super.setUp();

    const database = this.getDatabase();
    const imdb = new DummyGateway();

    this.useCase = new CreateTVSerie(database, imdb, IMDB_ID);
  }

  async testCreateTVSerie() {
    const tvSerieResponse = new OMDBTVSerieResult(IMDB_TV_SERIE_RESPONSE.data);

    this.stubFunction(this.useCase._imdb, 'fetchTVSerieById')
      .resolves(tvSerieResponse);

    const tvSeasonResponse = new OMDBTVSeasonResult(IMDB_TV_SEASON_RESPONSE.data);
    this.stubFunction(this.useCase._imdb, 'fetchTVSeasonBySerieId')
      .resolves(tvSeasonResponse);

    const tvEpisodeResponse = new OMDBTVEpisodeResult(IMDB_TV_EPISODE_RESPONSE.data);
    this.stubFunction(this.useCase._imdb, 'fetchTVEpisodeById')
      .resolves(tvEpisodeResponse);

    const tvSerie = await this.useCase.execute();

    this.assertThat(tvSerie).isInstanceOf(TVSerie);
    this.assertThat(tvSerie.id).doesExist();
    this.assertThat(tvSerie.imdbId).isEqual('tt0212671');
    this.assertThat(tvSerie.name).isEqual('Malcolm in the Middle');
    this.assertThat(tvSerie.plot).isEqual(
      'A gifted young teen tries to survive life with his dimwitted, dysfunctional family.'
    );
    this.assertThat(tvSerie.years).isEqual({ from: '2000', to: '2006' });
    this.assertThat(tvSerie.rated).isEqual('TV-PG');
    this.assertThat(tvSerie.genre).isEqual(['Comedy', 'Family']);
    this.assertThat(tvSerie.writers).isEqual(
      ['Linwood Boomer', 'Michael Glouberman', 'Gary Murphy']
    );
    this.assertThat(tvSerie.actors).isEqual(
      ['Frankie Muniz', 'Bryan Cranston', 'Justin Berfield']
    );
    this.assertThat(tvSerie.poster).isEqual(
      'https://m.media-amazon.com/images/M/MV5BNTc2MzM2N2YtZDdiOS00M2'
      + 'I2LWFjOGItMDM3OTA3YjUwNjAxXkEyXkFqcGdeQXVyNzA5NjUyNjM@._V1_SX300.jpg'
    );
    this.assertThat(tvSerie.imdbRating).isEqual('8.2/10');
    this.assertThat(tvSerie.totalSeasons).isEqual(7);
    this.assertThat(tvSerie.releasedAt).isInstanceOf(Date);
  }

  async testThrowErrorWhenIMDBFails() {
    this.stubFunction(this.useCase._imdb, 'fetchTVSerieById')
      .throws(new Error());

    await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotCreateTVSerie);
  }

  async testThrowErrorWhenSavingTVSerieFails() {
    this.stubFunction(this.useCase._database.tvSeries, 'create')
      .throws(new Error());

    await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotCreateTVSerie);
  }

  async testThrowErrorWhenSavingTVSeasonsFails() {
    this.stubFunction(this.useCase._database.tvSeasons, 'create')
      .throws(new Error());

    await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotCreateTVSeasons);
  }

  async testThrowErrorWhenSavingTVEpisodesFails() {
    this.stubFunction(this.useCase._database.tvEpisodes, 'create')
      .throws(new Error());

    await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotCreateTVSeasons);
  }
}
