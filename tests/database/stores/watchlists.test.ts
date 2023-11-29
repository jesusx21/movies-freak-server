import SQLTestCase from '../testHelper';

import SQLDatabase from '../../../database/stores/sql';
import { MarathonType } from '../../../typescript/customTypes';
import { SerializerError } from '../../../database/stores/sql/serializer';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';
import { Watchlist } from '../../../app/moviesFreak/entities';
import { WatchlistSerializer } from '../../../database/stores/sql/serializers';

class WatchlistsStoreTest extends SQLTestCase {
  database: SQLDatabase;

  setUp() {
    super.setUp();

    this.database = this.getDatabase();
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateWatchlistTest extends WatchlistsStoreTest {
  watchlist: Watchlist;

  setUp() {
    super.setUp();

    this.watchlist = new Watchlist({
      name: 'Maraton de Halloween',
      type: MarathonType.all,
      description: 'This is a nice watchlist',
      totalFilms: 0,
      totalTVEpisodes: 0
    });
  }

  async testCreateWatchlist() {
    const watchlistCreated = await this.database.watchlists.create(this.watchlist);

    this.assertThat(watchlistCreated).isInstanceOf(Watchlist);
    this.assertThat(watchlistCreated.id).doesExist();
    this.assertThat(watchlistCreated.name).isEqual('Maraton de Halloween');
    this.assertThat(watchlistCreated.type).isEqual('all');
    this.assertThat(watchlistCreated.description).isEqual('This is a nice watchlist');
    this.assertThat(watchlistCreated.totalFilms).isEqual(0);
    this.assertThat(watchlistCreated.totalTVEpisodes).isEqual(0);
  }

  async testThrowErrorOnSerializationError() {
    this.mockClass(WatchlistSerializer, 'static')
      .expects('fromJSON')
      .throws(new SerializerError());

    await this.assertThat(
      this.database.watchlists.create(this.watchlist)
    ).willBeRejectedWith(SerializerError);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this.database.watchlists, 'connection')
      .throws(new Error());

    await this.assertThat(
      this.database.watchlists.create(this.watchlist)
    ).willBeRejectedWith(SQLDatabaseException);
  }
}
