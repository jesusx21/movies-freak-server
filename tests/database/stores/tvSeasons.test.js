import { expect } from 'chai';

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

    expect(tvSeasonCreated).to.be.instanceOf(TVSeason);
    expect(tvSeasonCreated.id).to.exist;
    expect(tvSeasonCreated.tvSerieId).to.be.equal(this.tvSerie.id);
    expect(tvSeasonCreated.seasonNumber).to.be.equal(1);
    expect(tvSeasonCreated.plot).to.be.equal('This is the first season');
    expect(tvSeasonCreated.releasedAt).to.be.deep.equal(new Date(2010, 1, 25));
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.tvSeries, '_connection')
      .throws(new Error());

    await expect(
      this._database.tvSeries.create(this.tvSerie)
    ).to.be.rejectedWith(SQLDatabaseException);
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

    expect(tvSeasonFound).to.be.instanceOf(TVSeason);
    expect(tvSeasonFound.id).to.be.equal(this.tvSeasons[2].id);
    expect(tvSeasonFound.seasonNumber).to.be.equal(3);
  }

  async testThrowsErrorWhenTVSeasonIsNotFound() {
    await expect(
      this._database.tvSeasons.findById(this.generateUUID())
    ).to.be.rejectedWith(TVSeasonNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvSeasons, '_connection')
      .throws(new Error());

    await expect(
      this._database.tvSeasons.findById(this.tvSeasons[2].id)
    ).to.be.rejectedWith(SQLDatabaseException);
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

    expect(tvSeasons).to.have.lengthOf(5);
    expect(totalItems).to.be.equal(5);

    tvSeasons.forEach((tvSeason) => {
      expect(tvSeason).to.be.instanceOf(TVSeason);
      expect(tvSeason.tvSerieId).to.be.equal(this.tvSerie.id);
    });
  }

  async testFindWithSkip() {
    const { totalItems, items: tvSeasons } = await this._database
      .tvSeasons
      .findByTVSerieId(this.tvSerie.id, { skip: 2 });

    expect(tvSeasons).to.have.lengthOf(3);
    expect(totalItems).to.be.equal(5);
    expect(tvSeasons[0].seasonNumber).to.be.equal(3);
    expect(tvSeasons[1].seasonNumber).to.be.equal(4);
    expect(tvSeasons[2].seasonNumber).to.be.equal(5);
  }

  async testFindWithLimit() {
    const { totalItems, items: tvSeasons } = await this._database
      .tvSeasons
      .findByTVSerieId(this.tvSerie.id, { limit: 3 });

    expect(tvSeasons).to.have.lengthOf(3);
    expect(totalItems).to.be.equal(5);
    expect(tvSeasons[0].seasonNumber).to.be.equal(1);
    expect(tvSeasons[1].seasonNumber).to.be.equal(2);
    expect(tvSeasons[2].seasonNumber).to.be.equal(3);
  }

  async testFindWithSkipAndLimit() {
    const { totalItems, items: tvSeasons } = await this._database
      .tvSeasons
      .findByTVSerieId(this.tvSerie.id, { skip: 1, limit: 2 });

    expect(tvSeasons).to.have.lengthOf(2);
    expect(totalItems).to.be.equal(5);
    expect(tvSeasons[0].seasonNumber).to.be.equal(2);
    expect(tvSeasons[1].seasonNumber).to.be.equal(3);
  }

  async testReturnEmptyListWhenThereIsNotTVSeries() {
    const tvSerie = await this.createTVSerie(this._database);

    const { totalItems, items: tvSeasons } = await this._database
      .tvSeasons
      .findByTVSerieId(tvSerie.id);

    expect(tvSeasons).to.be.empty;
    expect(totalItems).to.be.equal(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvSeasons, '_connection')
      .throws(new Error());

    await expect(
      this._database.tvSeasons.findByTVSerieId(this.tvSerie.id)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}
