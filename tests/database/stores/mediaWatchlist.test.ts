import SQLTestCase from '../testHelper';

import { Film, MediaWatchlist, TVEpisode, Watchlist } from '../../../app/moviesFreak/entities';

class MediaWatchlistsTest extends SQLTestCase {
  film?: Film;
  tvEpisode?: TVEpisode;
  watchlist?: Watchlist;

  async setUp() {
    super.setUp();

    this.film = await this.createFilm(this.getDatabase(), { name: 'Harry Potter' });
    this.tvEpisode = await this.createTVEpisode(this.getDatabase(), { name: 'Friends' });
    this.watchlist = await this.createWatchlist(this.getDatabase(), { type: 'saga' });
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateMediaWatchlistTest extends MediaWatchlistsTest {
  async testCreateFilmWatchlist() {
    const mediaWatchlist = new MediaWatchlist({
      watchlistId: this.watchlist?.id || this.generateUUID(),
      index: 0,
      watched: false
    });

    const film = await this.createFilm(this.getDatabase(), { name: 'Harry Potter' });

    mediaWatchlist.setFilm(film);
    const filmWatchlist = await this.getDatabase()
      .mediaWatchlists
      .create(mediaWatchlist);

    this.assertThat(filmWatchlist).isInstanceOf(MediaWatchlist);
    this.assertThat(filmWatchlist.id).doesExist();
    this.assertThat(filmWatchlist.watchlistId).isEqual(this.watchlist?.id);
    this.assertThat(filmWatchlist.film).isInstanceOf(Film);
    this.assertThat(filmWatchlist.filmId).isEqual(film?.id);
    this.assertThat(filmWatchlist.film?.id).isEqual(film?.id);
    this.assertThat(filmWatchlist.index).isEqual(0);
    this.assertThat(filmWatchlist.watched).isFalse();
    this.assertThat(filmWatchlist.tvEpisode).doesNotExist();
    this.assertThat(filmWatchlist.tvEpisodeId).doesNotExist();
  }
}
