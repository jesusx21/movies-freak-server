import SQLTestCase from '../testHelper';

import { TVSeason, TVSerie } from '../../../app/moviesFreak/entities';
import { TVSeasonNotFound } from '../../../database/stores/errors';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { UUID } from '../../../types/common';

class TVSeasonsStoreTest extends SQLTestCase {
  tvSerie?: TVSerie;

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();

    this.tvSerie = await this.createTVSerie(this.database);
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateTVSeasonTest extends TVSeasonsStoreTest {
  async testCreateTvSeason() {
    const tvSeasonCreated = await this.getDatabase()
      .tvSeasons
      .create(this.buildTvSeason());

    this.assertThat(tvSeasonCreated).isInstanceOf(TVSeason);
    this.assertThat(tvSeasonCreated.id).doesExist();
    this.assertThat(tvSeasonCreated.tvSerieId).isEqual(this.tvSerie?.id);
    this.assertThat(tvSeasonCreated.seasonNumber).isEqual(1);
    this.assertThat(tvSeasonCreated.plot).isEqual('This is the first season');
    this.assertThat(tvSeasonCreated.releasedAt).isEqual(new Date(2010, 1, 25));
  }

  async testThrowErrorOnSQLException() {
    const database = this.getDatabase();

    this.stubFunction(database.tvSeasons, 'connection')
      .throws(new Error());

    await this.assertThat(
      database.tvSeasons.create(this.buildTvSeason())
    ).willBeRejectedWith(SQLDatabaseException);
  }

  private buildTvSeason() {
    return new TVSeason({
      tvSerieId: this.tvSerie?.id,
      seasonNumber: 1,
      plot: 'This is the first season',
      releasedAt: new Date(2010, 1, 25),
      poster: 'http://poster.com.tv/image'
    });
  }
}

export class FindByIdTest extends TVSeasonsStoreTest {
  tvSeasonId: UUID;
  tvSeasons: TVSeason[];

  constructor() {
    super();

    this.tvSeasons = [];
    this.tvSeasonId = this.generateUUID();
  }

  async setUp() {
    await super.setUp();

    this.tvSeasons = await this.createTVSeasons(
      this.getDatabase(),
      this.tvSerie?.id,
      [
        { seasonNumber: 1 },
        { seasonNumber: 2 },
        { seasonNumber: 3 }
      ]
    );

    this.tvSeasonId = this.tvSeasons[2].id || this.generateUUID();
  }

  async testFindTVSeasonById() {
    const tvSeasonFound = await this.getDatabase()
      .tvSeasons
      .findById(this.tvSeasonId);

    this.assertThat(tvSeasonFound).isInstanceOf(TVSeason);
    this.assertThat(tvSeasonFound.id).isEqual(this.tvSeasons[2].id);
    this.assertThat(tvSeasonFound.seasonNumber).isEqual(3);
  }

  async testThrowsErrorWhenTVSeasonIsNotFound() {
    await this.assertThat(
      this.getDatabase().tvSeasons.findById(this.generateUUID())
    ).willBeRejectedWith(TVSeasonNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.getDatabase().tvSeasons, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.getDatabase()
        .tvSeasons
        .findById(this.tvSeasonId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindBySerieIdTest extends TVSeasonsStoreTest {
  tvSerieId: UUID;

  constructor() {
    super();

    this.tvSerieId = this.generateUUID();
  }

  async setUp() {
    await super.setUp();

    await this.createTVSeasons(
      this.getDatabase(),
      this.tvSerie,
      [
        { seasonNumber: 1 },
        { seasonNumber: 2 },
        { seasonNumber: 3 },
        { seasonNumber: 4 },
        { seasonNumber: 5 }
      ]
    );

    this.tvSerieId = this.tvSerie?.id || this.generateUUID();
  }

  async testFindTVSerieSeasons() {
    const { totalItems, items: tvSeasons } = await this.getDatabase()
      .tvSeasons
      .findByTVSerieId(this.tvSerieId);

    this.assertThat(tvSeasons).hasLengthOf(5);
    this.assertThat(totalItems).isEqual(5);

    tvSeasons.forEach((tvSeason) => {
      this.assertThat(tvSeason).isInstanceOf(TVSeason);
      this.assertThat(tvSeason.tvSerieId).isEqual(this.tvSerieId);
    });
  }

  async testFindWithSkip() {
    const { totalItems, items: tvSeasons } = await this.getDatabase()
      .tvSeasons
      .findByTVSerieId(this.tvSerieId, { skip: 2 });

    this.assertThat(tvSeasons).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvSeasons[0].seasonNumber).isEqual(3);
    this.assertThat(tvSeasons[1].seasonNumber).isEqual(4);
    this.assertThat(tvSeasons[2].seasonNumber).isEqual(5);
  }

  async testFindWithLimit() {
    const { totalItems, items: tvSeasons } = await this.getDatabase()
      .tvSeasons
      .findByTVSerieId(this.tvSerieId, { limit: 3 });

    this.assertThat(tvSeasons).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvSeasons[0].seasonNumber).isEqual(1);
    this.assertThat(tvSeasons[1].seasonNumber).isEqual(2);
    this.assertThat(tvSeasons[2].seasonNumber).isEqual(3);
  }

  async testFindWithSkipAndLimit() {
    const { totalItems, items: tvSeasons } = await this.getDatabase()
      .tvSeasons
      .findByTVSerieId(this.tvSerieId, { skip: 1, limit: 2 });

    this.assertThat(tvSeasons).hasLengthOf(2);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvSeasons[0].seasonNumber).isEqual(2);
    this.assertThat(tvSeasons[1].seasonNumber).isEqual(3);
  }

  async testReturnEmptyListWhenThereIsNotTVSeries() {
    const tvSerie = await this.createTVSerie(this.getDatabase());
    const tvSerieId = tvSerie.id || this.generateUUID();

    const { totalItems, items: tvSeasons } = await this.getDatabase()
      .tvSeasons
      .findByTVSerieId(tvSerieId);

    this.assertThat(tvSeasons).isEmpty();
    this.assertThat(totalItems).isEqual(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this.getDatabase().tvSeasons, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.getDatabase().tvSeasons.findByTVSerieId(this.tvSerieId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
