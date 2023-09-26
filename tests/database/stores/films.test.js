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

    this.assertThat(filmCreated).isInstanceOf(Film);
    this.assertThat(filmCreated.id).exists;
    this.assertThat(filmCreated.name).isEqual('It Chapter I');
    this.assertThat(filmCreated.plot).isEqual('Is about a serial clown killer');
    this.assertThat(filmCreated.title).isEqual('It');
    this.assertThat(filmCreated.year).isEqual('2017');
    this.assertThat(filmCreated.rated).isEqual('pg-13');
    this.assertThat(filmCreated.runtime).isEqual('2 horas y media');
    this.assertThat(filmCreated.director).isEqual('El Andy Muscchieti');
    this.assertThat(filmCreated.poster).isEqual('www.film.com/poster');
    this.assertThat(filmCreated.production).isEqual('Warner Bros');
    this.assertThat(filmCreated.genre).isEqual(['coming out of age', 'thriller', 'horror']);
    this.assertThat(filmCreated.writers).isEqual(['I dunno']);
    this.assertThat(filmCreated.actors).isEqual(['Billy', 'Tom', 'Mike']);
    this.assertThat(filmCreated.imdbId).isEqual('45s4d7fsd');
    this.assertThat(filmCreated.imdbRating).isEqual('10 out of 10');
  }

  async testThrowErrorWhenUniqueFieldIsRepeated() {
    await this._database.films.create(this.film);

    const error = await this.assertThat(
      this._database.films.create(this.film)
    ).willBeRejectedWith(SQLDatabaseException);

    this.assertThat(error.message).hasSubstring(
      'duplicate key value violates unique constraint "films_imdb_id_unique"'
    );
  }

  async testThrowErrorOnSerializationError() {
    this.mockClass(FilmSerializer, 'static')
      .expects('fromJSON')
      .throws(new SerializerError());

    await this.assertThat(
      this._database.films.create(this.film)
    ).willBeRejectedWith(SerializerError);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.films, '_connection')
      .throws(new SerializerError());

    await this.assertThat(
      this._database.films.create(this.film)
    ).willBeRejectedWith(SQLDatabaseException);
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

    this.assertThat(filmFound).isInstanceOf(Film);
    this.assertThat(filmFound.id).isEqual(this.films[2].id);
    this.assertThat(filmFound.name).isEqual('It Chapter II');
    this.assertThat(filmFound.plot).isEqual('Another Horror Movie');
  }

  async testThrowsErrorWhenFilmIsNotFound() {
    await this.assertThat(
      this._database.films.findById(this.generateUUID())
    ).willBeRejectedWith(FilmNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this._database.films, '_connection')
      .throws(new SerializerError());

    await this.assertThat(
      this._database.films.findById(this.films[2].id)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindTest extends FilmsStoreTest {
  async testFindAllFilms() {
    await this.createFilms(this._database, 5);

    const { totalItems, items: films } = await this._database.films.find();

    this.assertThat(films).hasLengthOf(5);
    this.assertThat(totalItems).isEqual(5);
    films.forEach((film) => this.assertThat(film).isInstanceOf(Film));
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

    this.assertThat(films).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(films[0].name).isEqual('10 Things I Hate about You');
    this.assertThat(films[1].name).isEqual('The Perks of Being a Wallflower');
    this.assertThat(films[2].name).isEqual('Predestination');
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

    this.assertThat(films).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(films[0].name).isEqual('Midsomar');
    this.assertThat(films[1].name).isEqual('Nimona');
    this.assertThat(films[2].name).isEqual('10 Things I Hate about You');
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

    this.assertThat(films).hasLengthOf(2);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(films[0].name).isEqual('Nimona');
    this.assertThat(films[1].name).isEqual('10 Things I Hate about You');
  }

  async testReturnEmptyListWhenThereIsNotFilms() {
    const { totalItems, items: films } = await this._database.films.find();

    this.assertThat(films).isEmpty();
    this.assertThat(totalItems).isEqual(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this._database.films, '_connection')
      .throws(new SerializerError());

    await this.assertThat(
      this._database.films.find()
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
