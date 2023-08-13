import { expect } from 'chai';

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

    expect(film).to.be.instanceOf(Film);
    expect(film.id).to.exist;
    expect(film.name).to.be.equal('The Shawshank Redemption');
    expect(film.plot).to.be.equal(
      'Over the course of several years, two convicts form a friendship, '
      + 'seeking consolation and, eventually, redemption through basic compassion.'
    );
    expect(film.title).to.be.equal('The Shawshank Redemption');
    expect(film.year).to.be.equal('1994');
    expect(film.rated).to.be.equal('R');
    expect(film.runtime).to.be.equal('142 min');
    expect(film.director).to.be.equal('Frank Darabont');
    expect(film.poster).to.be.equal(
      'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmN'
      + 'lLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg'
    );
    expect(film.production).to.be.equal('N/A');
    expect(film.genre).to.be.deep.equal(['Drama']);
    expect(film.writers).to.be.deep.equal(['Stephen King', 'Frank Darabont']);
    expect(film.actors).to.be.deep.equal(['Tim Robbins', 'Morgan Freeman', 'Bob Gunton']);
    expect(film.imdbId).to.be.equal('tt0111161');
    expect(film.imdbRating).to.be.equal('9.3/10');
  }

  async testThrowErrorWhenIMDBFails() {
    this.stubFunction(this.useCase._imdb, 'fetchFilmById')
      .throws(new Error());

    await expect(
      this.useCase.execute()
    ).to.be.rejectedWith(CouldNotCreateFilm);
  }

  async testThrowErrorWhenDatabaseFails() {
    this.stubFunction(this.useCase._database.films, 'create')
      .throws(new Error());

    await expect(
      this.useCase.execute()
    ).to.be.rejectedWith(CouldNotCreateFilm);
  }
}
