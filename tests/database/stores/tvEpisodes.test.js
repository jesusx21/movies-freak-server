import { expect } from 'chai';

import SQLTestCase from '../testHelper';

import { TVEpisode } from '../../../app/moviesFreak/entities';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { TVEpisodeNotFound } from '../../../database/stores/errors';

class TVEpisodeTest extends SQLTestCase {
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

export class CreateTVEpisodeTest extends TVEpisodeTest {
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

    expect(tvEpsiodeCreated).to.be.instanceOf(TVEpisode);
    expect(tvEpsiodeCreated.id).to.exist;
    expect(tvEpsiodeCreated.tvSerieId).to.be.equal(this.tvSerie.id);
    expect(tvEpsiodeCreated.tvSeasonId).to.be.equal(this.tvSeason.id);
    expect(tvEpsiodeCreated.name).to.be.equal('How You Mother Met Me');
    expect(tvEpsiodeCreated.imdbId).to.be.equal('tt3390684');
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.tvSeries, '_connection')
      .throws(new Error());

    await expect(
      this._database.tvEpisodes.create(this.tvSerie)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}

export class FindByIdTest extends TVEpisodeTest {
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

    expect(tvEpisodeFound).to.be.instanceOf(TVEpisode);
    expect(tvEpisodeFound.id).to.be.equal(this.tvEpisodes[1].id);
    expect(tvEpisodeFound.seasonNumber).to.be.equal(7);
    expect(tvEpisodeFound.episodeNumber).to.be.equal(2);
  }

  async testThrowsErrorWhenTVEpisodeIsNotFound() {
    await expect(
      this._database.tvEpisodes.findById(this.generateUUID())
    ).to.be.rejectedWith(TVEpisodeNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvEpisodes, '_connection')
      .throws(new Error());

    await expect(
      this._database.tvEpisodes.findById(this.tvEpisodes[2].id)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}

export class FindByTVSeasonIdTest extends TVEpisodeTest {
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

    expect(tvEpisodes).to.have.lengthOf(5);
    expect(totalItems).to.be.equal(5);

    tvEpisodes.forEach((tvEpisode) => {
      expect(tvEpisode).to.be.instanceOf(TVEpisode);
      expect(tvEpisode.tvSerieId).to.be.equal(this.tvSerie.id);
    });
  }

  async testFindWithSkip() {
    const { totalItems, items: tvEpisodes } = await this._database
      .tvEpisodes
      .findByTVSeasonId(this.tvSeason.id, { skip: 2 });

    expect(tvEpisodes).to.have.lengthOf(3);
    expect(totalItems).to.be.equal(5);
    expect(tvEpisodes[0].episodeNumber).to.be.equal(3);
    expect(tvEpisodes[1].episodeNumber).to.be.equal(4);
    expect(tvEpisodes[2].episodeNumber).to.be.equal(5);
  }

  async testFindWithLimit() {
    const { totalItems, items: tvEpisodes } = await this._database
      .tvEpisodes
      .findByTVSeasonId(this.tvSeason.id, { limit: 3 });

    expect(tvEpisodes).to.have.lengthOf(3);
    expect(totalItems).to.be.equal(5);
    expect(tvEpisodes[0].episodeNumber).to.be.equal(1);
    expect(tvEpisodes[1].episodeNumber).to.be.equal(2);
    expect(tvEpisodes[2].episodeNumber).to.be.equal(3);
  }

  async testFindWithSkipAndLimit() {
    const { totalItems, items: tvEpisodes } = await this._database
      .tvEpisodes
      .findByTVSeasonId(this.tvSeason.id, { skip: 1, limit: 2 });

    expect(tvEpisodes).to.have.lengthOf(2);
    expect(totalItems).to.be.equal(5);
    expect(tvEpisodes[0].episodeNumber).to.be.equal(2);
    expect(tvEpisodes[1].episodeNumber).to.be.equal(3);
  }

  async testReturnEmptyListWhenThereIsNotTVEpisodes() {
    const tvSeason = await this.createTVSeason(this._database, this.tvSerie);

    const { totalItems, items: tvEpisodes } = await this._database
      .tvEpisodes
      .findByTVSeasonId(tvSeason.id);

    expect(tvEpisodes).to.be.empty;
    expect(totalItems).to.be.equal(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvEpisodes, '_connection')
      .throws(new Error());

    await expect(
      this._database.tvEpisodes.findByTVSeasonId(this.tvSeason.id)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}
