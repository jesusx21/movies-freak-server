import SQLTestCase from '../testHelper';

import SQLDatabase from '../../../database/stores/sql';
import { TVSerie } from '../../../app/moviesFreak/entities';
import { IMDBIdAlreadyExists, TVSerieNotFound } from '../../../database/stores/errors';
import Serializer, { SerializerError } from '../../../database/stores/sql/serializer';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { UUID } from '../../../types/common';

class TVSeriesStoreTest extends SQLTestCase {
  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateTVSerieTest extends TVSeriesStoreTest {
  tvSerie: TVSerie;

  constructor() {
    super();

    this.tvSerie = this.buildTVSerie();
  }

  setUp() {
    super.setUp();

    this.tvSerie = this.buildTVSerie();
  }

  async testCreateTVSerie() {
    const tvSerieCreated = await this.getDatabase()
      .tvSeries
      .create(this.tvSerie);

    this.assertThat(tvSerieCreated).isInstanceOf(TVSerie);
    this.assertThat(tvSerieCreated.id).doesExist();
    this.assertThat(tvSerieCreated.name).isEqual('Malcolm in the Middle');
    this.assertThat(tvSerieCreated.plot).isEqual(this.tvSerie.plot);
    this.assertThat(tvSerieCreated.years).isEqual({ from: '2000', to: '2006' });
    this.assertThat(tvSerieCreated.rated).isEqual('TV-PG');
    this.assertThat(tvSerieCreated.genre).isEqual(['Comedy', 'Family']);
    this.assertThat(tvSerieCreated.writers).isEqual(this.tvSerie.writers);
    this.assertThat(tvSerieCreated.actors).isEqual(this.tvSerie.actors);
    this.assertThat(tvSerieCreated.poster).isEqual(this.tvSerie.poster);
    this.assertThat(tvSerieCreated.imdbRating).isEqual('8.2/10');
    this.assertThat(tvSerieCreated.totalSeasons).isEqual(7);
    this.assertThat(tvSerieCreated.releasedAt).isEqual(this.tvSerie.releasedAt);
  }

  async testThrowErrorWhenUniqueFieldIsRepeated() {
    await this.getDatabase()
      .tvSeries
      .create(this.tvSerie);

    await this.assertThat(
      this.getDatabase()
      .tvSeries
      .create(this.tvSerie)
    ).willBeRejectedWith(IMDBIdAlreadyExists);
  }

  async testThrowErrorOnSerializationError() {
    this.mockClass(Serializer<TVSerie>)
      .expects('fromJSON')
      .throws(new SerializerError());

    await this.assertThat(
      this.getDatabase()
      .tvSeries
      .create(this.tvSerie)
    ).willBeRejectedWith(SerializerError);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.getDatabase().tvSeries, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.getDatabase()
        .tvSeries
        .create(this.tvSerie)
    ).willBeRejectedWith(SQLDatabaseException);
  }

  private buildTVSerie() {
    return new TVSerie({
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
}

export class FindByIdTest extends TVSeriesStoreTest {
  tvSeries: TVSerie[];
  tvSerieId: UUID;

  constructor() {
    super();

    this.tvSeries = [];
    this.tvSerieId = this.generateUUID();
  }

  async setUp() {
    super.setUp();

    this.tvSeries = await this.createTVSeries(
      this.getDatabase(),
      [
        { name: 'Steven Universe', plot: 'A Stone Kid' },
        { name: 'Adventure Time', plot: 'A Stoned Kid' },
        { name: 'Gravity Falls', plot: 'Another Stoned Kids' }
      ]
    );

    this.tvSerieId = this.tvSeries[2].id || this.generateUUID();
  }

  async testFindTVSerieById() {
    const tvSerieFound = await this.getDatabase()
      .tvSeries
      .findById(this.tvSerieId);

    this.assertThat(tvSerieFound).isInstanceOf(TVSerie);
    this.assertThat(tvSerieFound.id).isEqual(this.tvSerieId);
    this.assertThat(tvSerieFound.name).isEqual('Gravity Falls');
    this.assertThat(tvSerieFound.plot).isEqual('Another Stoned Kids');
  }

  async testThrowsErrorWhenTVSerieIsNotFound() {
    await this.assertThat(
      this.getDatabase()
        .tvSeries
        .findById(this.generateUUID())
    ).willBeRejectedWith(TVSerieNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.getDatabase().tvSeries, 'connection')
      .throws(new SerializerError());

    await this.assertThat(
      this.getDatabase()
        .tvSeries
        .findById(this.tvSerieId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindTest extends TVSeriesStoreTest {
  async testFindAllTVSeries() {
    await this.createTVSeries(this.getDatabase(), 5);

    const { totalItems, items: tvSeries } = await this.getDatabase()
      .tvSeries
      .find();

    this.assertThat(tvSeries).hasLengthOf(5);
    this.assertThat(totalItems).isEqual(5);
    tvSeries.forEach((tvSerie) => this.assertThat(tvSerie).isInstanceOf(TVSerie));
  }

  async testFindWithSkip() {
    await this.createTVSeries(
      this.getDatabase(),
      [
        { name: 'How I Met Your Mother' },
        { name: 'How I Met Your Father' },
        { name: 'Star Wars: Clone Wars' },
        { name: 'Star Wars: Rebels' },
        { name: 'Friends' }
      ]
    );

    const { totalItems, items: tvSeries } = await this.getDatabase()
      .tvSeries
      .find({ skip: 2 });

    this.assertThat(tvSeries).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvSeries[0].name).isEqual('Star Wars: Clone Wars');
    this.assertThat(tvSeries[1].name).isEqual('Star Wars: Rebels');
    this.assertThat(tvSeries[2].name).isEqual('Friends');
  }

  async testFindWithLimit() {
    await this.createTVSeries(
      this.getDatabase(),
      [
        { name: 'How I Met Your Mother' },
        { name: 'How I Met Your Father' },
        { name: 'Star Wars: Clone Wars' },
        { name: 'Star Wars: Rebels' },
        { name: 'Friends' }
      ]
    );

    const { totalItems, items: tvSeries } = await this.getDatabase()
      .tvSeries
      .find({ limit: 3 });

    this.assertThat(tvSeries).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvSeries[0].name).isEqual('How I Met Your Mother');
    this.assertThat(tvSeries[1].name).isEqual('How I Met Your Father');
    this.assertThat(tvSeries[2].name).isEqual('Star Wars: Clone Wars');
  }

  async testFindWithSkipAndLimit() {
    await this.createTVSeries(
      this.getDatabase(),
      [
        { name: 'How I Met Your Mother' },
        { name: 'How I Met Your Father' },
        { name: 'Star Wars: Clone Wars' },
        { name: 'Star Wars: Rebels' },
        { name: 'Friends' }
      ]
    );

    const { totalItems, items: tvSeries } = await this.getDatabase()
      .tvSeries
      .find({ limit: 2, skip: 1 });

    this.assertThat(tvSeries).hasLengthOf(2);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(tvSeries[0].name).isEqual('How I Met Your Father');
    this.assertThat(tvSeries[1].name).isEqual('Star Wars: Clone Wars');
  }

  async testReturnEmptyListWhenThereIsNotTVSeries() {
    const { totalItems, items: tvSeries } = await this.getDatabase()
      .tvSeries
      .find();

    this.assertThat(tvSeries).isEmpty();
    this.assertThat(totalItems).isEqual(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this.getDatabase().tvSeries, 'connection')
      .throws(new SerializerError());

    await this.assertThat(
      this.getDatabase()
        .tvSeries
        .find()
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
