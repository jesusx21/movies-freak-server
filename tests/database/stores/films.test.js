import { expect } from 'chai';

import SQLTestCase from '../testHelper';

import { Film } from '../../../app/moviesFreak/entities';
import { SerializerError } from '../../../database/stores/sql/serializer';
import { FilmSerializer } from '../../../database/stores/sql/serializers';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { FilmNotFound } from '../../../database/stores/errors';

class FilmsStoreTest extends SQLTestCase {
  setUp() {
    super.setUp();

    this._database = this.getDatabase();
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateFilmTest extends FilmsStoreTest {
  setUp() {
    super.setUp();

    this.film = new Film({
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
  }

  async testCreateFilm() {
    const filmCreated = await this._database.films.create(this.film);

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
  }

  async testThrowErrorWhenUniqueFieldIsRepeated() {
    await this._database.films.create(this.film);

    const error = await expect(
      this._database.films.create(this.film)
    ).to.be.rejectedWith(SQLDatabaseException);

    expect(error.message).to.have.string(
      'duplicate key value violates unique constraint "films_imdb_id_unique"'
    );
  }

  async testThrowErrorOnSerializationError() {
    this.mockClass(FilmSerializer, 'static')
      .expects('fromJSON')
      .throws(new SerializerError());

    await expect(
      this._database.films.create(this.film)
    ).to.be.rejectedWith(SerializerError);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.films, '_connection')
      .throws(new SerializerError());

    await expect(
      this._database.films.create(this.film)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}

export class FindByIdTest extends FilmsStoreTest {
  async setUp() {
    super.setUp();

    this.films = await this.createFilms(
      this._database,
      [
        { name: 'It Chapter I', plot: 'A Horror Movie' },
        { name: 'It Chapter III', plot: 'A Third Horror Movie' },
        { name: 'It Chapter II', plot: 'Another Horror Movie' }
      ]
    );
  }

  async testFindFilmById() {
    const filmFound = await this._database.films.findById(this.films[2].id);

    expect(filmFound).to.be.instanceOf(Film);
    expect(filmFound.id).to.be.equal(this.films[2].id);
    expect(filmFound.name).to.be.equal('It Chapter II');
    expect(filmFound.plot).to.be.equal('Another Horror Movie');
  }

  async testThrowsErrorWhenFilmIsNotFound() {
    await expect(
      this._database.films.findById(this.generateUUID())
    ).to.be.rejectedWith(FilmNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this._database.films, '_connection')
      .throws(new SerializerError());

    await expect(
      this._database.films.findById(this.films[2].id)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}

export class FindTest extends FilmsStoreTest {
  async testFindAllFilms() {
    await this.createFilms(this._database, 5);

    const { totalItems, items: films } = await this._database.films.find();

    expect(films).to.have.lengthOf(5);
    expect(totalItems).to.be.equal(5);
    films.forEach((film) => expect(film).to.be.instanceOf(Film));
  }

  async testFindWithSkip() {
    await this.createFilms(
      this._database,
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const { totalItems, items: films } = await this._database.films.find({ skip: 2 });

    expect(films).to.have.lengthOf(3);
    expect(totalItems).to.be.equal(5);
    expect(films[0].name).to.be.equal('10 Things I Hate about You');
    expect(films[1].name).to.be.equal('The Perks of Being a Wallflower');
    expect(films[2].name).to.be.equal('Predestination');
  }

  async testFindWithLimit() {
    await this.createFilms(
      this._database,
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const { totalItems, items: films } = await this._database.films.find({ limit: 3 });

    expect(films).to.have.lengthOf(3);
    expect(totalItems).to.be.equal(5);
    expect(films[0].name).to.be.equal('Midsomar');
    expect(films[1].name).to.be.equal('Nimona');
    expect(films[2].name).to.be.equal('10 Things I Hate about You');
  }

  async testFindWithSkipAndLimit() {
    await this.createFilms(
      this._database,
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const { totalItems, items: films } = await this._database.films.find({ limit: 2, skip: 1 });

    expect(films).to.have.lengthOf(2);
    expect(totalItems).to.be.equal(5);
    expect(films[0].name).to.be.equal('Nimona');
    expect(films[1].name).to.be.equal('10 Things I Hate about You');
  }

  async testReturnEmptyListWhenThereIsNotFilms() {
    const { totalItems, items: films } = await this._database.films.find();

    expect(films).to.be.empty;
    expect(totalItems).to.be.equal(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this._database.films, '_connection')
      .throws(new SerializerError());

    await expect(
      this._database.films.find()
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}
