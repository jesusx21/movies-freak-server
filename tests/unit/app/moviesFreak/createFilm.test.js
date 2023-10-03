import TestCase from '../../../testHelper';

import CreateFilm from '../../../../app/moviesFreak/createFilm';
import DummyGateway from '../../../../app/imdb/gateways/dummy/dummyGateway';
import { Film } from '../../../../app/moviesFreak/entities';
import { CouldNotCreateFilm } from '../../../../app/moviesFreak/errors';

const IMDB_ID = 'tt0111161';

export default class CreateFilmTest extends TestCase {
  setUp() {
    super.setUp();

    const database = this.getDatabase();
    const imdb = new DummyGateway();

    this.useCase = new CreateFilm(database, imdb, IMDB_ID);
  }

  async testCreateFilm() {
    const film = await this.useCase.execute();

    this.assertThat(film).isInstanceOf(Film);
    this.assertThat(film.id).doesExist();
    this.assertThat(film.name).isEqual('The Shawshank Redemption');
    this.assertThat(film.plot).isEqual(
      'Over the course of several years, two convicts form a friendship, '
      + 'seeking consolation and, eventually, redemption through basic compassion.'
    );
    this.assertThat(film.title).isEqual('The Shawshank Redemption');
    this.assertThat(film.year).isEqual('1994');
    this.assertThat(film.rated).isEqual('R');
    this.assertThat(film.runtime).isEqual('142 min');
    this.assertThat(film.director).isEqual('Frank Darabont');
    this.assertThat(film.poster).isEqual(
      'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmN'
      + 'lLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
    );
    this.assertThat(film.production).isEqual('N/A');
    this.assertThat(film.genre).isEqual(['Drama']);
    this.assertThat(film.writers).isEqual(['Stephen King', 'Frank Darabont']);
    this.assertThat(film.actors).isEqual(['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']);
    this.assertThat(film.imdbId).isEqual('tt0111161');
    this.assertThat(film.imdbRating).isEqual('9.3/10');
  }

  async testThrowErrorWhenIMDBFails() {
    this.stubFunction(this.useCase._imdb, 'fetchFilmById')
      .throws(new Error());

    await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotCreateFilm);
  }

  async testThrowErrorWhenDatabaseFails() {
    this.stubFunction(this.useCase._database.films, 'create')
      .throws(new Error());

    await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotCreateFilm);
  }
}
