import SQLTestCase from '../testHelper';

import SQLDatabase from '../../../database/stores/sql';
import { Film, MediaWatchlist, TVEpisode, Watchlist } from '../../../app/moviesFreak/entities';

class MediaWatchlistsTest extends SQLTestCase {
  database: SQLDatabase;
  film: Film;
  tvEpisode: TVEpisode;
  watchlist: Watchlist;

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();

    this.film = await this.createFilm(this.database, { name: 'Harry Potter' });
    this.tvEpisode = await this.createTVEpisode(this.database, { name: 'Friends' });
    this.watchlist = await this.createWatchlist(this.database);
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateTVSerieTest extends MediaWatchlistsTest {
  mediaWatchlist: MediaWatchlist;

  async setUp() {
    await super.setUp();

    this.mediaWatchlist = new MediaWatchlist({
      watchlistId: this.watchlist.id || this.generateUUID(),
      index: 0,
      watched: false
    });
  }

  async testCreateFilmWatchlist() {
    this.mediaWatchlist.setFilm(this.film);
    const filmWatchlist = await this.database.mediaWatchlists.create(this.mediaWatchlist);

    this.assertThat(filmWatchlist).isInstanceOf(MediaWatchlist);
    this.assertThat(filmWatchlist.id).doesExist();
    this.assertThat(filmWatchlist.watchlistId).isEqual(this.watchlist.id);
    this.assertThat(filmWatchlist.film).isInstanceOf(Film);
    this.assertThat(filmWatchlist.filmId).isEqual(this.film.id);
    this.assertThat(filmWatchlist.film?.id).isEqual(this.film.id);
    this.assertThat(filmWatchlist.index).isEqual(0);
    this.assertThat(filmWatchlist.watched).isFalse();
    this.assertThat(filmWatchlist.tvEpisode).doesNotExist();
    this.assertThat(filmWatchlist.tvEpisodeId).doesNotExist();
  }
}
