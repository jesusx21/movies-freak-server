import TestCase from '../../../testHelper';

import CreateWatchlist from '../../../../app/moviesFreak/createWatchlist';
import { CouldNotCreateWatchlist } from '../../../../app/moviesFreak/errors';
import { Database } from '../../../../types/database';
import { User, Watchlist } from '../../../../app/moviesFreak/entities';
import { Privacity } from '../../../../types/entities';

export default class CreateWatchlistTest extends TestCase {
  database: Database
  useCase?: CreateWatchlist;
  user?: User;

  constructor() {
    super();

    this.database = this.getDatabase();
  }

  async setUp() {
    super.setUp();

    this.database = this.getDatabase();
    this.user = await this.createUser(this.database);
    this.useCase = new CreateWatchlist(
      this.database,
      this.user,
      'Horroctober',
      Privacity.SHARED,
      'This is a decription'
    );
  }

  async testCreaateWatchlist() {
    const watchlist = await this.useCase?.execute();

    this.assertThat(watchlist).isInstanceOf(Watchlist);
    this.assertThat(watchlist?.id).doesExist();
    this.assertThat(watchlist?.userId).isEqual(this.user?.id);
    this.assertThat(watchlist?.name).isEqual('Horroctober');
    this.assertThat(watchlist?.privacity).isEqual(Privacity.SHARED);
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
