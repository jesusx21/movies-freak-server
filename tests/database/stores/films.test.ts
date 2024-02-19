import SQLTestCase from '../testHelper';

import Serializer, { SerializerError } from '../../../database/stores/sql/serializer';
import { Film } from '../../../app/moviesFreak/entities';
import { FilmNotFound, IMDBIdAlreadyExists } from '../../../database/stores/errors';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { UUID } from '../../../types/common';

class FilmsStoreTest extends SQLTestCase {
  setUp() {
    super.setUp();

    this.database = this.getDatabase();
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateFilmTest extends FilmsStoreTest {
  async testCreateFilm() {
    const filmCreated = await this.getDatabase()
      .films
      .create(this.buildFilm());

    this.assertThat(filmCreated).isInstanceOf(Film);
    this.assertThat(filmCreated.id).doesExist();
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
    await this.getDatabase()
      .films
      .create(this.buildFilm());

    await this.assertThat(
      this.getDatabase()
        .films
        .create(this.buildFilm())
    ).willBeRejectedWith(IMDBIdAlreadyExists);
  }

  async testThrowErrorOnSerializationError() {
    this.mockClass(Serializer<Film>)
      .expects('fromJSON')
      .throws(new SerializerError());

    await this.assertThat(
      this.getDatabase()
        .films
        .create(this.buildFilm())
    ).willBeRejectedWith(SerializerError);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.getDatabase().films, 'connection')
      .throws(new SerializerError());

    await this.assertThat(
      this.getDatabase().films.create(this.buildFilm())
    ).willBeRejectedWith(SQLDatabaseException);
  }

  private buildFilm() {
    return new Film({
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
}

export class FindByIdTest extends FilmsStoreTest {
  private films: Film[];
  private filmId: UUID;

  constructor() {
    super();

    this.films = [];
    this.filmId = this.generateUUID();
  }

  async setUp() {
    super.setUp();

    this.films = await this.createFilms(
      this.getDatabase(),
      [
        { name: 'It Chapter I', plot: 'A Horror Movie' },
        { name: 'It Chapter III', plot: 'A Third Horror Movie' },
        { name: 'It Chapter II', plot: 'Another Horror Movie' }
      ]
    );

    if (this.films[2]?.id) {
      this.filmId = this.films[2].id;
    } else {
      this.filmId = this.generateUUID();
    }
  }

  async testFindFilmById() {
    const filmFound = await this.getDatabase()
      .films
      .findById(this.filmId);

    this.assertThat(filmFound).isInstanceOf(Film);
    this.assertThat(filmFound.id).isEqual(this.films[2].id);
    this.assertThat(filmFound.name).isEqual('It Chapter II');
    this.assertThat(filmFound.plot).isEqual('Another Horror Movie');
  }

  async testThrowsErrorWhenFilmIsNotFound() {
    await this.assertThat(
      this.getDatabase()
        .films
        .findById(this.generateUUID())
    ).willBeRejectedWith(FilmNotFound);
  }

  async testThrowsErrorOnUnexpectedError() {
    this.stubFunction(this.getDatabase().films, 'connection')
      .throws(new SerializerError());

    await this.assertThat(
      this.getDatabase()
        .films
        .findById(this.filmId)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}

export class FindTest extends FilmsStoreTest {
  async testFindAllFilms() {
    await this.createFilms(this.getDatabase(), 5);

    const { totalItems, items: films } = await this.getDatabase()
      .films
      .find();

    this.assertThat(films).hasLengthOf(5);
    this.assertThat(totalItems).isEqual(5);
    films.forEach((film) => this.assertThat(film).isInstanceOf(Film));
  }

  async testFindWithSkip() {
    await this.createFilms(
      this.getDatabase(),
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const { totalItems, items: films } = await this.getDatabase()
      .films
      .find({ skip: 2 });

    this.assertThat(films).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(films[0].name).isEqual('10 Things I Hate about You');
    this.assertThat(films[1].name).isEqual('The Perks of Being a Wallflower');
    this.assertThat(films[2].name).isEqual('Predestination');
  }

  async testFindWithLimit() {
    await this.createFilms(
      this.getDatabase(),
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const { totalItems, items: films } = await this.getDatabase()
      .films
      .find({ limit: 3 });

    this.assertThat(films).hasLengthOf(3);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(films[0].name).isEqual('Midsomar');
    this.assertThat(films[1].name).isEqual('Nimona');
    this.assertThat(films[2].name).isEqual('10 Things I Hate about You');
  }

  async testFindWithSkipAndLimit() {
    await this.createFilms(
      this.getDatabase(),
      [
        { name: 'Midsomar' },
        { name: 'Nimona' },
        { name: '10 Things I Hate about You' },
        { name: 'The Perks of Being a Wallflower' },
        { name: 'Predestination' }
      ]
    );

    const { totalItems, items: films } = await this.getDatabase()
      .films
      .find({ limit: 2, skip: 1 });

    this.assertThat(films).hasLengthOf(2);
    this.assertThat(totalItems).isEqual(5);
    this.assertThat(films[0].name).isEqual('Nimona');
    this.assertThat(films[1].name).isEqual('10 Things I Hate about You');
  }

  async testReturnEmptyListWhenThereIsNotFilms() {
    const { totalItems, items: films } = await this.getDatabase()
      .films
      .find();

    this.assertThat(films).isEmpty();
    this.assertThat(totalItems).isEqual(0);
  }

  async testThrowErrorOnUnexpectedError() {
    this.stubFunction(this.getDatabase().films, 'connection')
      .throws(new SerializerError());

    await this.assertThat(
      this.getDatabase()
        .films
        .find()
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
