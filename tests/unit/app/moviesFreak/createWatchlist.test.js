import TestCase from '../../../testHelper';

import CreateWatchlist from '../../../../app/moviesFreak/createWatchlist';
import { Watchlist } from '../../../../app/moviesFreak/entities';
import { CouldNotCreateWatchlist, InvalidType } from '../../../../app/moviesFreak/errors';

export default class CreateWatchlistTest extends TestCase {
  setUp() {
    super.setUp();

    const database = this.getDatabase();

    this.useCase = new CreateWatchlist(
      database,
      'Horroctober',
      'marathon',
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

  async testThrowErrorOnInvalidType() {
    this.useCase._type = 'invalid-type';

    this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(InvalidType);
  }

  async testThrowErrorWhenDatabaseFails() {
    this.stubFunction(this.useCase._database.watchlists, 'create')
      .throws(new Error());

    await this.assertThat(
      this.useCase.execute()
    ).willBeRejectedWith(CouldNotCreateWatchlist);
  }
}
