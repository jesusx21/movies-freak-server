import TestCase from '../../../testHelper';

import CreateWatchlist from '../../../../app/moviesFreak/createWatchlist';
import { CouldNotCreateWatchlist } from '../../../../app/moviesFreak/errors';
import { Database } from '../../../../types/database';
import { Watchlist } from '../../../../app/moviesFreak/entities';
import { MarathonType } from '../../../../types/entities';

export default class CreateWatchlistTest extends TestCase {
  database: Database
  useCase?: CreateWatchlist;

  constructor() {
    super();

    this.database = this.getDatabase();
  }

  setUp() {
    super.setUp();

    this.database = this.getDatabase();
    this.useCase = new CreateWatchlist(
      this.database,
      'Horroctober',
      MarathonType.MARATHON,
      'This is a decription'
    );
  }

  async testCreaateWatchlist() {
    const watchlist = await this.useCase?.execute();

    this.assertThat(watchlist).isInstanceOf(Watchlist);
    this.assertThat(watchlist?.id).doesExist();
    this.assertThat(watchlist?.name).isEqual('Horroctober');
    this.assertThat(watchlist?.type).isEqual('marathon');
    this.assertThat(watchlist?.description).isEqual('This is a decription');
  }

  async testThrowErrorWhenDatabaseFails() {
    this.stubFunction(this.database.watchlists, 'create')
      .throws(new Error());

    await this.assertThat(
      this.useCase?.execute()
    ).willBeRejectedWith(CouldNotCreateWatchlist);
  }
}
