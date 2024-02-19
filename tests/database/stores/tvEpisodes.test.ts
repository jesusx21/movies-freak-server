import SQLTestCase from '../testHelper';

import { TVEpisode, TVSeason, TVSerie } from '../../../app/moviesFreak/entities';
import { TVEpisodeNotFound } from '../../../database/stores/errors';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { UUID } from '../../../types/common';

class TVEpisodesStoreTest extends SQLTestCase {
  tvSerie?: TVSerie;
  tvSeason?: TVSeason;

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();

    this.tvSerie = await this.createTVSerie(this.database);
    this.tvSeason = await this.createTVSeason(this.database, this.tvSerie);
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateTVEpisodeTest extends TVEpisodesStoreTest {
  async testCreateTVEpisode() {
    const tvEpsiodeCreated = await this.getDatabase()
      .tvEpisodes
      .create(this.buildTVEpisode());

    this.assertThat(tvEpsiodeCreated).isInstanceOf(TVEpisode);
    this.assertThat(tvEpsiodeCreated.id).doesExist();
    this.assertThat(tvEpsiodeCreated.tvSerieId).isEqual(this.tvSerie?.id);
    this.assertThat(tvEpsiodeCreated.tvSeasonId).isEqual(this.tvSeason?.id);
    this.assertThat(tvEpsiodeCreated.name).isEqual('How You Mother Met Me');
    this.assertThat(tvEpsiodeCreated.imdbId).isEqual('tt3390684');
  }

  async testThrowErrorOnSQLException() {
    const database = this.getDatabase();

    this.stubFunction(database.tvEpisodes, 'connection')
      .throws(new Error());

    await this.assertThat(
      database.tvEpisodes.create(this.buildTVEpisode())
    ).willBeRejectedWith(SQLDatabaseException);
  }

  private buildTVEpisode() {
    return new TVEpisode({
      imdbId: 'tt3390684',
      name: 'How You Mother Met Me',
      year: 2013,
      seasonNumber: 9,
      episodeNumber: 16,
      genre: ['Comedy', 'Romantic'],
      director: 'Jon Doe',
      writers: ['Jon Doe', 'Jane Doe'],
      actors: ['Neil Patrick Harris', 'Cobbie Smulders'],
      plot: 'I dont remember what plot is this',
      languages: ['English'],
      country: 'United States',
      poster: 'http://series.com.tv/himymPoster.jpg',
      awards: 'Grammy',
      imdbRating: '8/10',
      releasedAt: new Date(2013, 3, 5),
      tvSeasonId: this.tvSeason?.id,
      tvSerieId: this.tvSerie?.id,
    });
  }
}

export class FindByIdTest extends TVEpisodesStoreTest {
  tvEpisodeId?: UUID;
  tvEpisodes: TVEpisode[];

  constructor() {
    super();

    this.tvEpisodes = [];
  }

  async setUp() {
    await super.setUp();

    this.tvEpisodes = await this.createTVEpisodes(
      this.getDatabase(),
      this.tvSeason,
      [
        { seasonNumber: 7, episodeNumber: 1 },
        { seasonNumber: 7, episodeNumber: 2 },
        { seasonNumber: 7, episodeNumber: 3 }
      ]
    );

  }

  async testFindTvEpisodeById() {
    const tvEpisodeId = this.tvEpisodes[1]?.id || this.generateUUID();

    const tvEpisodeFound = await this.getDatabase().
      tvEpisodes
      .findById(tvEpisodeId);

    this.assertThat(tvEpisodeFound).isInstanceOf(TVEpisode);
    this.assertThat(tvEpisodeFound.id).isEqual(tvEpisodeId);
    this.assertThat(tvEpisodeFound.seasonNumber).isEqual(7);
    this.assertThat(tvEpisodeFound.episodeNumber).isEqual(2);
  }

  async testThrowsErrorWhenTVEpisodeIsNotFound() {
    await this.assertThat(
      this.getDatabase()
        .tvEpisodes
        .findById(this.generateUUID())
    ).willBeRejectedWith(TVEpisodeNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    const database = this.getDatabase();
    const tvEpisodeId = this.tvEpisodes[1]?.id || this.generateUUID();

    this.stubFunction(database.tvEpisodes, 'connection')
      .throws(new Error());

    await this.assertThat(
      database.tvEpisodes.findById(tvEpisodeId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindByTVSeasonIdTest extends TVEpisodesStoreTest {
  tvSeasonId: UUID;

  constructor() {
    super();

    this.tvSeasonId = this.generateUUID();
  }

  async setUp() {
    await super.setUp();

    await this.createTVEpisodes(
      this.getDatabase(),
      this.tvSeason,
      [
        { seasonNumber: 3, episodeNumber: 1 },
        { seasonNumber: 3, episodeNumber: 2 },
        { seasonNumber: 3, episodeNumber: 3 },
        { seasonNumber: 3, episodeNumber: 4 },
        { seasonNumber: 3, episodeNumber: 5 }
      ]
    );

    this.tvSeasonId = this.tvSeason?.id || this.generateUUID();
  }

  async testFindTVSeasonEpisodes() {
    const { totalItems, items: tvEpisodes } = await this.getDatabase()
      .tvEpisodes
      .findByTVSeasonId(this.tvSeasonId);

    this.assertThat(tvEpisodes).hasLengthOf(5);
    this.assertThat(totalItems).isEqual(5);

    tvEpisodes.forEach((tvEpisode) => {
      this.assertThat(tvEpisode).isInstanceOf(TVEpisode);
      this.assertThat(tvEpisode.tvSerieId).isEqual(this.tvSerie?.id);
    });
  }

  async testFindWithSkip() {
    const { totalItems, items: tvEpisodes } = await this.getDatabase()
      .tvEpisodes
      .findByTVSeasonId(this.tvSeasonId, { skip: 2 });

    this.assertThat(tvEpisodes).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvEpisodes[0].episodeNumber).isEqual(3);
    this.assertThat(tvEpisodes[1].episodeNumber).isEqual(4);
    this.assertThat(tvEpisodes[2].episodeNumber).isEqual(5);
  }

  async testFindWithLimit() {
    const { totalItems, items: tvEpisodes } = await this.getDatabase()
      .tvEpisodes
      .findByTVSeasonId(this.tvSeasonId, { limit: 3 });

    this.assertThat(tvEpisodes).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvEpisodes[0].episodeNumber).isEqual(1);
    this.assertThat(tvEpisodes[1].episodeNumber).isEqual(2);
    this.assertThat(tvEpisodes[2].episodeNumber).isEqual(3);
  }

  async testFindWithSkipAndLimit() {
    const { totalItems, items: tvEpisodes } = await this.getDatabase()
      .tvEpisodes
      .findByTVSeasonId(this.tvSeasonId, { skip: 1, limit: 2 });

    this.assertThat(tvEpisodes).hasLengthOf(2);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvEpisodes[0].episodeNumber).isEqual(2);
    this.assertThat(tvEpisodes[1].episodeNumber).isEqual(3);
  }

  async testReturnEmptyListWhenThereIsNotTVEpisodes() {
    const tvSeason = await this.createTVSeason(this.getDatabase(), this.tvSerie);
    const tvSeasonId = tvSeason.id || this.generateUUID();

    const { totalItems, items: tvEpisodes } = await this.getDatabase()
      .tvEpisodes
      .findByTVSeasonId(tvSeasonId);

    this.assertThat(tvEpisodes).isEmpty();
    this.assertThat(totalItems).isEqual(0);
  }

  async testThrowErrorOnUnexpectedError() {
    const database = this.getDatabase();

    this.stubFunction(database.tvEpisodes, 'connection')
      .throws(new Error());

    await this.assertThat(
      database.tvEpisodes.findByTVSeasonId(this.tvSeasonId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
