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
        databaseTestHelper.mockClass(FilmSerializer, 'static')
          .expects('fromJSON')
          .throws(new SerializerError());

        await expect(
          database.films.create(film)
        ).to.be.rejectedWith(SerializerError);
      });

      it('should throw error on sql exception', async () => {
        databaseTestHelper.stubFunction(database.films, '_connection')
          .throws(new SerializerError());

        await expect(
          database.films.create(film)
        ).to.be.rejectedWith(SQLDatabaseException);
      });
    });

    describe('#findById', () => {
      let film;

      beforeEach(async () => {
        await databaseTestHelper.createFilms(
          database,
          { name: 'It Chapter I', plot: 'A Horror Movie' }
        );
        await databaseTestHelper.createFilm(
          database,
          { name: 'It Chapter III', plot: 'A Third Horror Movie' }
        );
        film = await databaseTestHelper.createFilm(
          database,
          { name: 'It Chapter II', plot: 'Another Horror Movie' }
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
        databaseTestHelper.stubFunction(database.films, '_connection')
          .throws(new SerializerError());

        await expect(
          database.films.findById(film.id)
        ).to.be.rejectedWith(SQLDatabaseException);
      });
    });

    describe('#find', () => {
      it('should find all films stored', async () => {
        await databaseTestHelper.createFilms(database, 5);

        const { totalItems, items: films } = await database.films.find();

        expect(films).to.have.lengthOf(5);
        expect(totalItems).to.be.equal(5);
        films.forEach((film) => expect(film).to.be.instanceOf(Film));
      });

      it('should get items with skip', async () => {
        await databaseTestHelper.createFilms(
          database,
          [
            { name: 'Midsomar' },
            { name: 'Nimona' },
            { name: '10 Things I Hate about You' },
            { name: 'The Perks of Being a Wallflower' },
            { name: 'Predestination' }
          ]
        );

        const { totalItems, items: films } = await database.films.find({ skip: 2 });

        expect(films).to.have.lengthOf(3);
        expect(totalItems).to.be.equal(5);
        expect(films[0].name).to.be.equal('10 Things I Hate about You');
        expect(films[1].name).to.be.equal('The Perks of Being a Wallflower');
        expect(films[2].name).to.be.equal('Predestination');
      });

      it('should get items with limit', async () => {
        await databaseTestHelper.createFilms(
          database,
          [
            { name: 'Midsomar' },
            { name: 'Nimona' },
            { name: '10 Things I Hate about You' },
            { name: 'The Perks of Being a Wallflower' },
            { name: 'Predestination' }
          ]
        );

        const { totalItems, items: films } = await database.films.find({ limit: 3 });

        expect(films).to.have.lengthOf(3);
        expect(totalItems).to.be.equal(5);
        expect(films[0].name).to.be.equal('Midsomar');
        expect(films[1].name).to.be.equal('Nimona');
        expect(films[2].name).to.be.equal('10 Things I Hate about You');
      });

      it('should get items with skip and limit', async () => {
        await databaseTestHelper.createFilms(
          database,
          [
            { name: 'Midsomar' },
            { name: 'Nimona' },
            { name: '10 Things I Hate about You' },
            { name: 'The Perks of Being a Wallflower' },
            { name: 'Predestination' }
          ]
        );

        const { totalItems, items: films } = await database.films.find({ limit: 2, skip: 1 });

        expect(films).to.have.lengthOf(2);
        expect(totalItems).to.be.equal(5);
        expect(films[0].name).to.be.equal('Nimona');
        expect(films[1].name).to.be.equal('10 Things I Hate about You');
      });

      it('should return empty array when there is no films', async () => {
        const { totalItems, items: films } = await database.films.find();

        expect(films).to.be.empty;
        expect(totalItems).to.be.equal(0);
      });

      it('should return handled error on unexpected error', async () => {
        databaseTestHelper.stubFunction(database.films, '_connection')
          .throws(new SerializerError());

        await expect(
          database.films.find()
        ).to.be.rejectedWith(SQLDatabaseException);
      });
    });
  });
});
