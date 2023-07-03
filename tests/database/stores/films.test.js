import { Film } from '../../../app/movies-freak/entities';
import { SerializerError } from '../../../database/stores/sql/serializer';
import { FilmSerializer } from '../../../database/stores/sql/serializers';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { FilmNotFound } from '../../../database/stores/errors';

describe('Database - Stores', () => {
  describe('Films', () => {
    let database;
    let film;

    beforeEach(() => {
      databaseTestHelper.createSandbox();

      database = databaseTestHelper.getDatabase();
      film = new Film({});
    });

    afterEach(() => {
      databaseTestHelper.restoreSandbox();
    })

    describe('#create', () => {
      let film;

      beforeEach(() => {
        film = new Film({
          name: 'It Chapter I',
          plot: 'Is about a serial clown killer'
        });
      });

      it('should create a film', async () => {
        const filmCreated = await database.films.create(film);

        expect(filmCreated).to.be.instanceOf(Film);
        expect(filmCreated.id).to.exist;
        expect(filmCreated.name).to.be.equal('It Chapter I');
        expect(filmCreated.plot).to.be.equal('Is about a serial clown killer');
      });
  
      it('should thrown error on serialization error', async () => {
        databaseTestHelper.mockClass(FilmSerializer)
          .expects('fromJSON')
          .throws(new SerializerError());

        await expect(
          database.films.create(film)
        ).to.be.rejectedWith(SerializerError);
      });
  
      it('should thrown error on sql exception', async () => {
        databaseTestHelper.stubFunction(database, 'connection')
          .throws(new SerializerError());

        await expect(
          database.films.create(film)
        ).to.be.rejectedWith(SQLDatabaseException);
      });
    });

    describe('#findById', () => {
      let film;

      beforeEach(async () => {
        await databaseTestHelper.createFilm(database, 'It Chapter I', 'A Horror Movie');
        film = await databaseTestHelper.createFilm(database, 'It Chapter II', 'Another Horror Movie');
        await databaseTestHelper.createFilm(database, 'It Chapter III', 'A Third Horror Movie');
      });

      it('should find film by its id', async () => {
        const filmFound = await database.films.findById(film.id);

        expect(filmFound).to.be.instanceOf(Film);
        expect(filmFound.id).to.be.equal(film.id);
        expect(filmFound.name).to.be.equal('It Chapter II');
        expect(filmFound.plot).to.be.equal('Another Horror Movie');
      });

      it('should throws error when film does not exist', async() => {
        await expect(
          database.films.findById(databaseTestHelper.generateUUID())
        ).to.be.rejectedWith(FilmNotFound);
      });

      it('should throws error on unexpected error', async () => {
        databaseTestHelper.stubFunction(database, 'connection')
          .throws(new SerializerError());

        await expect(
          database.films.findById(film.id)
        ).to.be.rejectedWith(SQLDatabaseException);
      });
    });
  });
});