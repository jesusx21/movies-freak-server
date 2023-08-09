import { expect } from 'chai';

import SQLTestCase from '../testHelper';

import { TVSerie } from '../../../app/moviesFreak/entities';
import { TVSerieNotFound } from '../../../database/stores/errors';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { SerializerError } from '../../../database/stores/sql/serializer';
import { TVSerieSerializer } from '../../../database/stores/sql/serializers';

class TVStoreTest extends SQLTestCase {
  setUp() {
    super.setUp();

    this._database = this.getDatabase();
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateTVSerieTest extends TVStoreTest {
  setUp() {
    super.setUp();

    this.tvSerie = new TVSerie({
      imdbId: 'tt0212671',
      name: 'Malcolm in the Middle',
      plot: 'An offbeat, laugh track-lacking sitcom about a bizarrely dysfunctional family, '
        + 'the center of which is Malcolm, the middle of the two brothers '
        + 'who still live at home. His eldest (and favorite) sibling, Francis, '
        + 'boards at military school because his parents believe it will reform him and '
        + 'keep him out of trouble. Malcolm often has a hard time coping '
        + 'with his family life, but he has more troubles to contend with when he starts '
        + 'receiving special treatment at school after being diagnosed as an intellectually '
        + 'advanced genius.',
      years: { from: '2000', to: '2006' },
      rated: 'TV-PG',
      genre: ['Comedy', 'Family'],
      writers: ['Linwood Boomer', 'Michael Glouberman', 'Gary Murphy'],
      actors: ['Frankie Muniz', 'Bryan Cranston', 'Justin Berfield'],
      poster: 'https://m.media-amazon.com/images/M/MV5BNTc2MzM2N2YtZDdiOS00M2I2LWFjOGItMDM3'
        + 'OTA3YjUwNjAxXkEyXkFqcGdeQXVyNzA5NjUyNjM@._V1_SX300.jpg',
      imdbRating: '8.2/10',
      totalSeasons: 7,
      releasedAt: new Date(2000, 1, 9)
    });
  }

  async testCreateTVSerie() {
    const tvSerieCreated = await this._database.tvSeries.create(this.tvSerie);

    expect(tvSerieCreated).to.be.an.instanceOf(TVSerie);
    expect(tvSerieCreated.id).to.exist;
    expect(tvSerieCreated.name).to.be.equal('Malcolm in the Middle');
    expect(tvSerieCreated.plot).to.be.equal(this.tvSerie.plot);
    expect(tvSerieCreated.years).to.be.deep.equal({ from: '2000', to: '2006' });
    expect(tvSerieCreated.rated).to.be.equal('TV-PG');
    expect(tvSerieCreated.genre).to.be.deep.equal(['Comedy', 'Family']);
    expect(tvSerieCreated.writers).to.be.deep.equal(this.tvSerie.writers);
    expect(tvSerieCreated.actors).to.be.deep.equal(this.tvSerie.actors);
    expect(tvSerieCreated.poster).to.be.equal(this.tvSerie.poster);
    expect(tvSerieCreated.imdbRating).to.be.equal('8.2/10');
    expect(tvSerieCreated.totalSeasons).to.be.equal(7);
    expect(tvSerieCreated.releasedAt).to.be.deep.equal(this.tvSerie.releasedAt);
  }

  async testThrowErrorWhenUniqueFieldIsRepeated() {
    await this._database.tvSeries.create(this.tvSerie);

    const error = await expect(
      this._database.tvSeries.create(this.tvSerie)
    ).to.be.rejectedWith(SQLDatabaseException);

    expect(error.message).to.have.string(
      'duplicate key value violates unique constraint "tv_series_imdb_id_unique"'
    );
  }

  async testThrowErrorOnSerializationError() {
    this.mockClass(TVSerieSerializer, 'static')
      .expects('fromJSON')
      .throws(new SerializerError());

    await expect(
      this._database.tvSeries.create(this.tvSerie)
    ).to.be.rejectedWith(SerializerError);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.tvSeries, '_connection')
      .throws(new SerializerError());

    await expect(
      this._database.tvSeries.create(this.tvSerie)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}

export class FindByIdTest extends TVStoreTest {
  async setUp() {
    super.setUp();

    this.tvSeries = await this.createTVSeries(
      this._database,
      [
        { name: 'Steven Universe', plot: 'A Stone Kid' },
        { name: 'Adventure Time', plot: 'A Stoned Kid' },
        { name: 'Gravity Falls', plot: 'Another Stoned Kids' }
      ]
    );
  }

  async testFindTVSerieById() {
    const tvSerieFound = await this._database.tvSeries.findById(this.tvSeries[2].id);

    expect(tvSerieFound).to.be.instanceOf(TVSerie);
    expect(tvSerieFound.id).to.be.equal(this.tvSeries[2].id);
    expect(tvSerieFound.name).to.be.equal('Gravity Falls');
    expect(tvSerieFound.plot).to.be.equal('Another Stoned Kids');
  }

  async testThrowsErrorWhenTVSerieIsNotFound() {
    await expect(
      this._database.tvSeries.findById(this.generateUUID())
    ).to.be.rejectedWith(TVSerieNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvSeries, '_connection')
      .throws(new SerializerError());

    await expect(
      this._database.tvSeries.findById(this.tvSeries[2].id)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}

export class FindTest extends TVStoreTest {
  async testFindAllTVSeries() {
    await this.createTVSeries(this._database, 5);

    const { totalItems, items: tvSeries } = await this._database.tvSeries.find();

    expect(tvSeries).to.have.lengthOf(5);
    expect(totalItems).to.be.equal(5);
    tvSeries.forEach((tvSerie) => expect(tvSerie).to.be.instanceOf(TVSerie));
  }

  async testFindWithSkip() {
    await this.createTVSeries(
      this._database,
      [
        { name: 'How I Met Your Mother' },
        { name: 'How I Met Your Father' },
        { name: 'Star Wars: Clone Wars' },
        { name: 'Star Wars: Rebels' },
        { name: 'Friends' }
      ]
    );

    const { totalItems, items: tvSeries } = await this._database.tvSeries.find({ skip: 2 });

    expect(tvSeries).to.have.lengthOf(3);
    expect(totalItems).to.be.equal(5);
    expect(tvSeries[0].name).to.be.equal('Star Wars: Clone Wars');
    expect(tvSeries[1].name).to.be.equal('Star Wars: Rebels');
    expect(tvSeries[2].name).to.be.equal('Friends');
  }

  async testFindWithLimit() {
    await this.createTVSeries(
      this._database,
      [
        { name: 'How I Met Your Mother' },
        { name: 'How I Met Your Father' },
        { name: 'Star Wars: Clone Wars' },
        { name: 'Star Wars: Rebels' },
        { name: 'Friends' }
      ]
    );

    const { totalItems, items: tvSeries } = await this._database.tvSeries.find({ limit: 3 });

    expect(tvSeries).to.have.lengthOf(3);
    expect(totalItems).to.be.equal(5);
    expect(tvSeries[0].name).to.be.equal('How I Met Your Mother');
    expect(tvSeries[1].name).to.be.equal('How I Met Your Father');
    expect(tvSeries[2].name).to.be.equal('Star Wars: Clone Wars');
  }

  async testFindWithSkipAndLimit() {
    await this.createTVSeries(
      this._database,
      [
        { name: 'How I Met Your Mother' },
        { name: 'How I Met Your Father' },
        { name: 'Star Wars: Clone Wars' },
        { name: 'Star Wars: Rebels' },
        { name: 'Friends' }
      ]
    );

    const { totalItems, items: tvSeries } = await this._database.tvSeries.find(
      { limit: 2, skip: 1 }
    );

    expect(tvSeries).to.have.lengthOf(2);
    expect(totalItems).to.be.equal(5);
    expect(tvSeries[0].name).to.be.equal('How I Met Your Father');
    expect(tvSeries[1].name).to.be.equal('Star Wars: Clone Wars');
  }

  async testReturnEmptyListWhenThereIsNotTVSeries() {
    const { totalItems, items: tvSeries } = await this._database.tvSeries.find();

    expect(tvSeries).to.be.empty;
    expect(totalItems).to.be.equal(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this._database.tvSeries, '_connection')
      .throws(new SerializerError());

    await expect(
      this._database.tvSeries.find()
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}
