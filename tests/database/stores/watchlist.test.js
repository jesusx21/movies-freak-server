import { expect } from 'chai';

import SQLTestCase from '../testHelper';

import { Watchlist } from '../../../app/moviesFreak/entities';
import { WatchlistSerializer } from '../../../database/stores/sql/serializers';
import { SerializerError } from '../../../database/stores/sql/serializer';
import { SQLDatabaseException } from '../../../database/stores/sql/errors';

class WatchlistTest extends SQLTestCase {
  setUp() {
    super.setUp();

    this._database = this.getDatabase();
  }

  async tearDown() {
    super.tearDown();

    await this.cleanDatabase();
  }
}

export class CreateWatchlistTest extends WatchlistTest {
  setUp() {
    super.setUp();

    this.watchlist = new Watchlist({
      name: 'Maraton de Halloween',
      type: 'all',
      description: 'This is a nice watchlist',
      totalFilms: 0,
      totalTVEpisodes: 0
    });
  }

  async testCreateWatchlist() {
    const watchlistCreated = await this._database.watchlists.create(this.watchlist);

    expect(watchlistCreated).to.instanceOf(Watchlist);
    expect(watchlistCreated.id).to.exist;
    expect(watchlistCreated.name).to.be.equal('Maraton de Halloween');
    expect(watchlistCreated.type).to.be.equal('all');
    expect(watchlistCreated.description).to.be.equal('This is a nice watchlist');
    expect(watchlistCreated.totalFilms).to.be.equal(0);
    expect(watchlistCreated.totalTVEpisodes).to.be.equal(0);
  }

  async testThrowErrorOnSerializationError() {
    this.mockClass(WatchlistSerializer, 'static')
      .expects('fromJSON')
      .throws(new SerializerError());

    await expect(
      this._database.watchlists.create(this.watchlist)
    ).to.be.rejectedWith(SerializerError);
  }

  async testThrowErrorOnSQLException() {
    this.stubFunction(this._database.watchlists, '_connection')
      .throws(new Error());

    await expect(
      this._database.watchlists.create(this.watchlist)
    ).to.be.rejectedWith(SQLDatabaseException);
  }
}
