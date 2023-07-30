import { TVSerie } from '../../../app/moviesFreak/entities';
import { TVSerieNotFound } from '../../../database/stores/errors';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { SerializerError } from '../../../database/stores/sql/serializer';
import { TVSerieSerializer } from '../../../database/stores/sql/serializers';

describe('Database - Stores', () => {
  describe('TV Series', () => {
    let database;

    beforeEach(() => {
      databaseTestHelper.createSandbox();

      database = databaseTestHelper.getDatabase();
    });

    afterEach(async () => {
      databaseTestHelper.restoreSandbox();
      await databaseTestHelper.cleanDatabase();
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
        databaseTestHelper.mockClass(TVSerieSerializer)
          .expects('fromJSON')
          .throws(new SerializerError());

        await expect(
          database.tvSeries.create(tvSerie)
        ).to.be.rejectedWith(SerializerError);
      });

      it('should throw error on unexpected sql exception', async () => {
        databaseTestHelper.stubFunction(database.tvSeries, '_connection')
          .throws(new SerializerError());

        await expect(
          database.tvSeries.create(tvSerie)
        ).to.be.rejectedWith(SQLDatabaseException);
      });
    });

    describe('#findById', () => {
      let tvSerie;

      beforeEach(async () => {
        await databaseTestHelper.createTVSerie(
          database,
          { name: 'Steven Universe', plot: 'A Stone Kid' }
        );
        await databaseTestHelper.createTVSerie(
          database,
          { name: 'Adventure Time', plot: 'A Stoned Kid' }
        );
        tvSerie = await databaseTestHelper.createTVSerie(
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
          database.tvSeries.findById(databaseTestHelper.generateUUID())
        ).to.be.rejectedWith(TVSerieNotFound);
      });

      it('should throws error on unexpected error', async () => {
        databaseTestHelper.stubFunction(database.tvSeries, '_connection')
          .throws(new SerializerError());

        await expect(
          database.tvSeries.findById(tvSerie.id)
        ).to.be.rejectedWith(SQLDatabaseException);
      });
    });
  });
});
