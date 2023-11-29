import TestCase from '../../../testHelper';

import CreateWatchlist from '../../../../app/moviesFreak/createWatchlist';
import { CouldNotCreateWatchlist } from '../../../../app/moviesFreak/errors';
import { MarathonType } from '../../../../typescript/customTypes';
import { Watchlist } from '../../../../app/moviesFreak/entities';

export default class CreateWatchlistTest extends TestCase {
  useCase: CreateWatchlist;

  setUp() {
    super.setUp();

    const database = this.getDatabase();

    this.useCase = new CreateWatchlist(
      database,
      'Horroctober',
      MarathonType.marathon,
      'This is a decription'
    );
  }

  async testCreaateWatchlist() {
    const watchlist = await this.useCase.execute();

    this.assertThat(watchlist).isInstanceOf(Watchlist);
    this.assertThat(watchlist.id).doesExist();
    this.assertThat(watchlist.name).isEqual('Horroctober');
    this.assertThat(watchlist.type).isEqual('marathon');
    this.assertThat(watchlist.description).isEqual('This is a decription');
  }

  async testThrowErrorWhenDatabaseFails() {
    this.stubFunction(this.useCase.database.watchlists, 'create')
      .throws(new Error());

    await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotCreateWatchlist);
  }
}
