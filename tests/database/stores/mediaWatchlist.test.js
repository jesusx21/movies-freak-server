import { expect } from 'chai';

import SQLTestCase from '../testHelper';

import { Film, MediaWatchlist } from '../../../app/moviesFreak/entities';

class MediaWatchlistsTest extends SQLTestCase {
  async setUp() {
    super.setUp();

    this._database = this.getDatabase();

    this.film = await this.createFilm(this._database, { name: 'Harry Potter' });
    this.tvEpisode = await this.createTVEpisode(this._database, { name: 'Friends' });
    this.watchlist = await this.createWatchlist(this._database);
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateTVSerieTest extends MediaWatchlistsTest {
  async setUp() {
    await super.setUp();

    this.mediaWatchlist = new MediaWatchlist({
      watchlistId: this.watchlist.id,
      index: 0,
      watched: false
    });
  }

  async testCreateFilmWatchlist() {
    this.mediaWatchlist.setFilm(this.film);
    const filmWatchlist = await this._database.mediaWatchlists.create(this.mediaWatchlist);

    expect(filmWatchlist).to.be.instanceOf(MediaWatchlist);
    expect(filmWatchlist.id).to.exist;
    expect(filmWatchlist.watchlistId).to.be.equal(this.watchlist.id);
    expect(filmWatchlist.film).to.be.instanceOf(Film);
    expect(filmWatchlist.filmId).to.be.equal(this.film.id);
    expect(filmWatchlist.film.id).to.be.equal(this.film.id);
    expect(filmWatchlist.index).to.be.equal(0);
    expect(filmWatchlist.watched).to.be.false;
    expect(filmWatchlist.tvEpisode).to.not.exist;
    expect(filmWatchlist.tvEpisodeId).to.not.exist;
  }
}
