import SQLTestCase from '../testHelper';

import { TVEpisode } from '../../../app/moviesFreak/entities';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { TVEpisodeNotFound } from '../../../database/stores/errors';

class TVEpisodesStoreTest extends SQLTestCase {
  async setUp() {
    super.setUp();

    this._database = this.getDatabase();

    this.tvSerie = await this.createTVSerie(this._database);
    this.tvSeason = await this.createTVSeason(this._database, this.tvSerie);
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateTVEpisodeTest extends TVEpisodesStoreTest {
  async setUp() {
    await super.setUp();

    this.tvEpisode = new TVEpisode({
      tvSeasonId: this.tvSeason.id,
      tvSerieId: this.tvSerie.id,
      name: 'How You Mother Met Me',
      imdbId: 'tt3390684',
      episodeNumber: 16,
      seasonNumber: 9
    });
  }

  async testCreateTVEpisode() {
    const tvEpsiodeCreated = await this._database.tvEpisodes.create(this.tvEpisode);

    this.assertThat(tvEpsiodeCreated).isInstanceOf(TVEpisode);
    this.assertThat(tvEpsiodeCreated.id).doesExist();
    this.assertThat(tvEpsiodeCreated.tvSerieId).isEqual(this.tvSerie.id);
    this.assertThat(tvEpsiodeCreated.tvSeasonId).isEqual(this.tvSeason.id);
    this.assertThat(tvEpsiodeCreated.name).isEqual('How You Mother Met Me');
    this.assertThat(tvEpsiodeCreated.imdbId).isEqual('tt3390684');
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.tvSeries, '_connection')
      .throws(new Error());

    await this.assertThat(
      this._database.tvEpisodes.create(this.tvSerie)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindByIdTest extends TVEpisodesStoreTest {
  async setUp() {
    await super.setUp();

    this.tvEpisodes = await this.createTVEpisodes(
      this._database,
      this.tvSeason,
      [
        { seasonNumber: 7, episodeNumber: 1 },
        { seasonNumber: 7, episodeNumber: 2 },
        { seasonNumber: 7, episodeNumber: 3 }
      ]
    );
  }

  async testFindTvEpisodeById() {
    const tvEpisodeFound = await this._database.tvEpisodes.findById(this.tvEpisodes[1].id);

    this.assertThat(tvEpisodeFound).isInstanceOf(TVEpisode);
    this.assertThat(tvEpisodeFound.id).isEqual(this.tvEpisodes[1].id);
    this.assertThat(tvEpisodeFound.seasonNumber).isEqual(7);
    this.assertThat(tvEpisodeFound.episodeNumber).isEqual(2);
  }

  async testThrowsErrorWhenTVEpisodeIsNotFound() {
    await this.assertThat(
      this._database.tvEpisodes.findById(this.generateUUID())
    ).willBeRejectedWith(TVEpisodeNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvEpisodes, '_connection')
      .throws(new Error());

    await this.assertThat(
      this._database.tvEpisodes.findById(this.tvEpisodes[2].id)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindByTVSeasonIdTest extends TVEpisodesStoreTest {
  async setUp() {
    await super.setUp();

    await this.createTVEpisodes(
      this._database,
      this.tvSeason,
      [
        { seasonNumber: 3, episodeNumber: 1 },
        { seasonNumber: 3, episodeNumber: 2 },
        { seasonNumber: 3, episodeNumber: 3 },
        { seasonNumber: 3, episodeNumber: 4 },
        { seasonNumber: 3, episodeNumber: 5 }
      ]
    );
  }

  async testFindTVSeasonEpisodes() {
    const { totalItems, items: tvEpisodes } = await this._database
      .tvEpisodes
      .findByTVSeasonId(this.tvSeason.id);

    this.assertThat(tvEpisodes).hasLengthOf(5);
    this.assertThat(totalItems).isEqual(5);

    tvEpisodes.forEach((tvEpisode) => {
      this.assertThat(tvEpisode).isInstanceOf(TVEpisode);
      this.assertThat(tvEpisode.tvSerieId).isEqual(this.tvSerie.id);
    });
  }

  async testFindWithSkip() {
    const { totalItems, items: tvEpisodes } = await this._database
      .tvEpisodes
      .findByTVSeasonId(this.tvSeason.id, { skip: 2 });

    this.assertThat(tvEpisodes).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvEpisodes[0].episodeNumber).isEqual(3);
    this.assertThat(tvEpisodes[1].episodeNumber).isEqual(4);
    this.assertThat(tvEpisodes[2].episodeNumber).isEqual(5);
  }

  async testFindWithLimit() {
    const { totalItems, items: tvEpisodes } = await this._database
      .tvEpisodes
      .findByTVSeasonId(this.tvSeason.id, { limit: 3 });

    this.assertThat(tvEpisodes).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvEpisodes[0].episodeNumber).isEqual(1);
    this.assertThat(tvEpisodes[1].episodeNumber).isEqual(2);
    this.assertThat(tvEpisodes[2].episodeNumber).isEqual(3);
  }

  async testFindWithSkipAndLimit() {
    const { totalItems, items: tvEpisodes } = await this._database
      .tvEpisodes
      .findByTVSeasonId(this.tvSeason.id, { skip: 1, limit: 2 });

    this.assertThat(tvEpisodes).hasLengthOf(2);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvEpisodes[0].episodeNumber).isEqual(2);
    this.assertThat(tvEpisodes[1].episodeNumber).isEqual(3);
  }

  async testReturnEmptyListWhenThereIsNotTVEpisodes() {
    const tvSeason = await this.createTVSeason(this._database, this.tvSerie);

    const { totalItems, items: tvEpisodes } = await this._database
      .tvEpisodes
      .findByTVSeasonId(tvSeason.id);

    this.assertThat(tvEpisodes).isEmpty();
    this.assertThat(totalItems).isEqual(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvEpisodes, '_connection')
      .throws(new Error());

    await this.assertThat(
      this._database.tvEpisodes.findByTVSeasonId(this.tvSeason.id)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
