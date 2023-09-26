import SQLTestCase from '../testHelper';

import { TVSeason } from '../../../app/moviesFreak/entities';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { TVSeasonNotFound } from '../../../database/stores/errors';

class TVSeasonsStoreTest extends SQLTestCase {
  async setUp() {
    super.setUp();

    this._database = this.getDatabase();

    this.tvSerie = await this.createTVSerie(this._database);
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateTVSeasonTest extends TVSeasonsStoreTest {
  async setUp() {
    await super.setUp();

    this.tvSeason = new TVSeason({
      tvSerieId: this.tvSerie.id,
      seasonNumber: 1,
      plot: 'This is the first season',
      releasedAt: new Date(2010, 1, 25)
    });
  }

  async testCreateTvSeason() {
    const tvSeasonCreated = await this._database.tvSeasons.create(this.tvSeason);

    this.assertThat(tvSeasonCreated).isInstanceOf(TVSeason);
    this.assertThat(tvSeasonCreated.id).doesExist();
    this.assertThat(tvSeasonCreated.tvSerieId).isEqual(this.tvSerie.id);
    this.assertThat(tvSeasonCreated.seasonNumber).isEqual(1);
    this.assertThat(tvSeasonCreated.plot).isEqual('This is the first season');
    this.assertThat(tvSeasonCreated.releasedAt).isEqual(new Date(2010, 1, 25));
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.tvSeries, '_connection')
      .throws(new Error());

    await this.assertThat(
      this._database.tvSeries.create(this.tvSerie)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindByIdTest extends TVSeasonsStoreTest {
  async setUp() {
    await super.setUp();

    this.tvSeasons = await this.createTVSeasons(
      this._database,
      this.tvSerie.id,
      [
        { seasonNumber: 1 },
        { seasonNumber: 2 },
        { seasonNumber: 3 }
      ]
    );
  }

  async testFindTVSeasonById() {
    const tvSeasonFound = await this._database.tvSeasons.findById(this.tvSeasons[2].id);

    this.assertThat(tvSeasonFound).isInstanceOf(TVSeason);
    this.assertThat(tvSeasonFound.id).isEqual(this.tvSeasons[2].id);
    this.assertThat(tvSeasonFound.seasonNumber).isEqual(3);
  }

  async testThrowsErrorWhenTVSeasonIsNotFound() {
    await this.assertThat(
      this._database.tvSeasons.findById(this.generateUUID())
    ).willBeRejectedWith(TVSeasonNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvSeasons, '_connection')
      .throws(new Error());

    await this.assertThat(
      this._database.tvSeasons.findById(this.tvSeasons[2].id)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindBySerieIdTest extends TVSeasonsStoreTest {
  async setUp() {
    await super.setUp();

    await this.createTVSeasons(
      this._database,
      this.tvSerie,
      [
        { seasonNumber: 1 },
        { seasonNumber: 2 },
        { seasonNumber: 3 },
        { seasonNumber: 4 },
        { seasonNumber: 5 }
      ]
    );
  }

  async testFindTVSerieSeasons() {
    const { totalItems, items: tvSeasons } = await this._database
      .tvSeasons
      .findByTVSerieId(this.tvSerie.id);

    this.assertThat(tvSeasons).hasLengthOf(5);
    this.assertThat(totalItems).isEqual(5);

    tvSeasons.forEach((tvSeason) => {
      this.assertThat(tvSeason).isInstanceOf(TVSeason);
      this.assertThat(tvSeason.tvSerieId).isEqual(this.tvSerie.id);
    });
  }

  async testFindWithSkip() {
    const { totalItems, items: tvSeasons } = await this._database
      .tvSeasons
      .findByTVSerieId(this.tvSerie.id, { skip: 2 });

    this.assertThat(tvSeasons).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvSeasons[0].seasonNumber).isEqual(3);
    this.assertThat(tvSeasons[1].seasonNumber).isEqual(4);
    this.assertThat(tvSeasons[2].seasonNumber).isEqual(5);
  }

  async testFindWithLimit() {
    const { totalItems, items: tvSeasons } = await this._database
      .tvSeasons
      .findByTVSerieId(this.tvSerie.id, { limit: 3 });

    this.assertThat(tvSeasons).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvSeasons[0].seasonNumber).isEqual(1);
    this.assertThat(tvSeasons[1].seasonNumber).isEqual(2);
    this.assertThat(tvSeasons[2].seasonNumber).isEqual(3);
  }

  async testFindWithSkipAndLimit() {
    const { totalItems, items: tvSeasons } = await this._database
      .tvSeasons
      .findByTVSerieId(this.tvSerie.id, { skip: 1, limit: 2 });

    this.assertThat(tvSeasons).hasLengthOf(2);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvSeasons[0].seasonNumber).isEqual(2);
    this.assertThat(tvSeasons[1].seasonNumber).isEqual(3);
  }

  async testReturnEmptyListWhenThereIsNotTVSeries() {
    const tvSerie = await this.createTVSerie(this._database);

    const { totalItems, items: tvSeasons } = await this._database
      .tvSeasons
      .findByTVSerieId(tvSerie.id);

    this.assertThat(tvSeasons).isEmpty();
    this.assertThat(totalItems).isEqual(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvSeasons, '_connection')
      .throws(new Error());

    await this.assertThat(
      this._database.tvSeasons.findByTVSerieId(this.tvSerie.id)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
