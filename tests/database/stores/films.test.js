import { Film } from '../../../app/moviesFreak/entities';
import { SerializerError } from '../../../database/stores/sql/serializer';
import { FilmSerializer } from '../../../database/stores/sql/serializers';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { FilmNotFound } from '../../../database/stores/errors';

describe('Database - Stores', () => {
  describe('Films', () => {
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
      let film;

      beforeEach(() => {
        film = new Film({
          name: 'It Chapter I',
          plot: 'Is about a serial clown killer',
          title: 'It',
          year: '2017',
          rated: 'pg-13',
          runtime: '2 horas y media',
          director: 'El Andy Muscchieti',
          poster: 'www.film.com/poster',
          production: 'Warner Bros',
          genre: ['coming out of age', 'thriller', 'horror'],
          writers: ['I dunno'],
          actors: ['Billy', 'Tom', 'Mike'],
          imdbId: '45s4d7fsd',
          imdbRating: '10 out of 10'
        });
      });

      it('should create a film', async () => {
        const filmCreated = await database.films.create(film);

        expect(filmCreated).to.be.instanceOf(Film);
        expect(filmCreated.id).to.exist;
        expect(filmCreated.name).to.be.equal('It Chapter I');
        expect(filmCreated.plot).to.be.equal('Is about a serial clown killer');
        expect(filmCreated.title).to.be.equal('It');
        expect(filmCreated.year).to.be.equal('2017');
        expect(filmCreated.rated).to.be.equal('pg-13');
        expect(filmCreated.runtime).to.be.equal('2 horas y media');
        expect(filmCreated.director).to.be.equal('El Andy Muscchieti');
        expect(filmCreated.poster).to.be.equal('www.film.com/poster');
        expect(filmCreated.production).to.be.equal('Warner Bros');
        expect(filmCreated.genre).to.be.deep.equal(['coming out of age', 'thriller', 'horror']);
        expect(filmCreated.writers).to.be.deep.equal(['I dunno']);
        expect(filmCreated.actors).to.be.deep.equal(['Billy', 'Tom', 'Mike']);
        expect(filmCreated.imdbId).to.be.equal('45s4d7fsd');
        expect(filmCreated.imdbRating).to.be.equal('10 out of 10');
      });

      it('should thrown error when unique field is repeated', async () => {
        await database.films.create(film);

        const error = await expect(
          database.films.create(film)
        ).to.be.rejectedWith(SQLDatabaseException);

        expect(error.message).to.have.string(
          'duplicate key value violates unique constraint "films_imdb_id_unique"'
        );
      });

      it('should throw error on serialization error', async () => {
        databaseTestHelper.mockClass(FilmSerializer)
          .expects('fromJSON')
          .throws(new SerializerError());

        await expect(
          database.films.create(film)
        ).to.be.rejectedWith(SerializerError);
      });

      it('should throw error on sql exception', async () => {
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
        await databaseTestHelper.createFilm(database, 'It Chapter III', 'A Third Horror Movie');
        film = await databaseTestHelper.createFilm(
          database,
          'It Chapter II',
          'Another Horror Movie'
        );
      });

      it('should find film by its id', async () => {
        const filmFound = await database.films.findById(film.id);

        expect(filmFound).to.be.instanceOf(Film);
        expect(filmFound.id).to.be.equal(film.id);
        expect(filmFound.name).to.be.equal('It Chapter II');
        expect(filmFound.plot).to.be.equal('Another Horror Movie');
      });

      it('should throws error when film does not exist', async () => {
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
