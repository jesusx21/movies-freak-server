import { TVSerie } from '../../../app/moviesFreak/entities';
import { TVSerieNotFound } from '../../../database/stores/errors';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { SerializerError } from '../../../database/stores/sql/serializer';
import { TVSerieSerializer } from '../../../database/stores/sql/serializers';
import DatabaseTestHelper from '../testHelper';

describe('Database - Stores', () => {
  describe('TV Series', () => {
    let database;
    let testHelper;

    beforeEach(() => {
      testHelper = new DatabaseTestHelper();
      testHelper.createSandbox();
      testHelper.buildDatabase();

      database = testHelper.getDatabase();
    });

    afterEach(async () => {
      testHelper.restoreSandbox();
      await testHelper.cleanDatabase();
    });

    describe('#create', () => {
      let tvSerie;

      beforeEach(() => {
        tvSerie = new TVSerie({
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
      });

      it('should create a tv serie', async () => {
        const tvSerieCreated = await database.tvSeries.create(tvSerie);

        expect(tvSerieCreated).to.be.an.instanceOf(TVSerie);
        expect(tvSerieCreated.id).to.exist;
        expect(tvSerieCreated.name).to.be.equal('Malcolm in the Middle');
        expect(tvSerieCreated.plot).to.be.equal(tvSerie.plot);
        expect(tvSerieCreated.years).to.be.deep.equal({ from: '2000', to: '2006' });
        expect(tvSerieCreated.rated).to.be.equal('TV-PG');
        expect(tvSerieCreated.genre).to.be.deep.equal(['Comedy', 'Family']);
        expect(tvSerieCreated.writers).to.be.deep.equal(tvSerie.writers);
        expect(tvSerieCreated.actors).to.be.deep.equal(tvSerie.actors);
        expect(tvSerieCreated.poster).to.be.equal(tvSerie.poster);
        expect(tvSerieCreated.imdbRating).to.be.equal('8.2/10');
        expect(tvSerieCreated.totalSeasons).to.be.equal(7);
        expect(tvSerieCreated.releasedAt).to.be.deep.equal(tvSerie.releasedAt);
      });

      it('should throw error when unique field is repeated', async () => {
        await database.tvSeries.create(tvSerie);

        const error = await expect(
          database.tvSeries.create(tvSerie)
        ).to.be.rejectedWith(SQLDatabaseException);

        expect(error.message).to.have.string(
          'duplicate key value violates unique constraint "tv_series_imdb_id_unique"'
        );
      });

      it('should throw error on serialization error', async () => {
        testHelper.mockClass(TVSerieSerializer, 'static')
          .expects('fromJSON')
          .throws(new SerializerError());

        await expect(
          database.tvSeries.create(tvSerie)
        ).to.be.rejectedWith(SerializerError);
      });

      it('should throw error on unexpected sql exception', async () => {
        testHelper.stubFunction(database.tvSeries, '_connection')
          .throws(new SerializerError());

        await expect(
          database.tvSeries.create(tvSerie)
        ).to.be.rejectedWith(SQLDatabaseException);
      });
    });

    describe('#find', () => {
      it('should get tv series', async () => {
        await testHelper.createTVSeries({ quantity: 5 });

        const tvSeries = await database.tvSeries.find();

        expect(tvSeries).to.have.lengthOf(5);
        tvSeries.forEach(film => expect(film).to.be.instanceOf(TVSerie));
      });

      it('should get empty array when there is no films', async () => {
        const tvSeries = await database.tvSeries.find();

        expect(tvSeries).to.be.empty;
      });

      it('should throws error on unexpected error', async () => {
        testHelper.stubFunction(database, 'connection')
          .throws(new SerializerError());

        await expect(
          database.tvSeries.find()
        ).to.be.rejectedWith(SQLDatabaseException);
      });
    });

    describe('#findById', () => {
      let tvSerie;

      beforeEach(async () => {
        await testHelper.createTVSerie(
          database,
          { name: 'Steven Universe', plot: 'A Stone Kid' }
        );
        await testHelper.createTVSerie(
          database,
          { name: 'Adventure Time', plot: 'A Stoned Kid' }
        );
        tvSerie = await testHelper.createTVSerie(
          database,
          { name: 'Gravity Falls', plot: 'Another Stoned Kids' }
        );
      });

      it('should find tv serie by its id', async () => {
        const tvSerieFound = await database.tvSeries.findById(tvSerie.id);

        expect(tvSerieFound).to.be.instanceOf(TVSerie);
        expect(tvSerieFound.id).to.be.equal(tvSerie.id);
        expect(tvSerieFound.name).to.be.equal('Gravity Falls');
        expect(tvSerieFound.plot).to.be.equal('Another Stoned Kids');
      });

      it('should throws error when tv serie does not exist', async () => {
        await expect(
          database.tvSeries.findById(testHelper.generateUUID())
        ).to.be.rejectedWith(TVSerieNotFound);
      });

      it('should throws error on unexpected error', async () => {
        testHelper.stubFunction(database.tvSeries, '_connection')
          .throws(new SerializerError());

        await expect(
          database.tvSeries.findById(tvSerie.id)
        ).to.be.rejectedWith(SQLDatabaseException);
      });
    });

    describe('#find', () => {
      it('should find all tv series stored', async () => {
        await databaseTestHelper.createTVSeries(database, 5);

        const { totalItems, items: tvSeries } = await database.tvSeries.find();

        expect(tvSeries).to.have.lengthOf(5);
        expect(totalItems).to.be.equal(5);
        tvSeries.forEach((tvSerie) => expect(tvSerie).to.be.instanceOf(TVSerie));
      });

      it('should get items with skip', async () => {
        await databaseTestHelper.createTVSeries(
          database,
          [
            { name: 'How I Met Your Mother' },
            { name: 'How I Met Your Father' },
            { name: 'Star Wars: Clone Wars' },
            { name: 'Star Wars: Rebels' },
            { name: 'Friends' }
          ]
        );

        const { totalItems, items: tvSeries } = await database.tvSeries.find({ skip: 2 });

        expect(tvSeries).to.have.lengthOf(3);
        expect(totalItems).to.be.equal(5);
        expect(tvSeries[0].name).to.be.equal('Star Wars: Clone Wars');
        expect(tvSeries[1].name).to.be.equal('Star Wars: Rebels');
        expect(tvSeries[2].name).to.be.equal('Friends');
      });

      it('should get items with limit', async () => {
        await databaseTestHelper.createTVSeries(
          database,
          [
            { name: 'How I Met Your Mother' },
            { name: 'How I Met Your Father' },
            { name: 'Star Wars: Clone Wars' },
            { name: 'Star Wars: Rebels' },
            { name: 'Friends' }
          ]
        );

        const { totalItems, items: tvSeries } = await database.tvSeries.find({ limit: 3 });

        expect(tvSeries).to.have.lengthOf(3);
        expect(totalItems).to.be.equal(5);
        expect(tvSeries[0].name).to.be.equal('How I Met Your Mother');
        expect(tvSeries[1].name).to.be.equal('How I Met Your Father');
        expect(tvSeries[2].name).to.be.equal('Star Wars: Clone Wars');
      });

      it('should get items with skip and limit', async () => {
        await databaseTestHelper.createTVSeries(
          database,
          [
            { name: 'How I Met Your Mother' },
            { name: 'How I Met Your Father' },
            { name: 'Star Wars: Clone Wars' },
            { name: 'Star Wars: Rebels' },
            { name: 'Friends' }
          ]
        );

        const { totalItems, items: tvSeries } = await database.tvSeries.find({ limit: 2, skip: 1 });

        expect(tvSeries).to.have.lengthOf(2);
        expect(totalItems).to.be.equal(5);
        expect(tvSeries[0].name).to.be.equal('How I Met Your Father');
        expect(tvSeries[1].name).to.be.equal('Star Wars: Clone Wars');
      });

      it('should return empty array when there is no tv series', async () => {
        const { totalItems, items: tvSeries } = await database.tvSeries.find();

        expect(tvSeries).to.be.empty;
        expect(totalItems).to.be.equal(0);
      });

      it('should return handled error on unexpected error', async () => {
        databaseTestHelper.stubFunction(database.tvSeries, '_connection')
          .throws(new SerializerError());

        await expect(
          database.tvSeries.find()
        ).to.be.rejectedWith(SQLDatabaseException);
      });
    });
  });
});
