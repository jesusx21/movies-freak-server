import { Monopoly } from '../../../boardGame';
import { HTTPStatusCode, Request, SingleResponse } from '../../../boardGame/types';

import CreateWatchlist from '../../../app/moviesFreak/createWatchlist';
import { Watchlist } from '../../../app/moviesFreak/entities';
import { HTTPInternalError } from '../../httpResponses';

export default class WatchlistsResource extends Monopoly {
  async onPost(req: Request): Promise<SingleResponse> {
    const { name, description, privacity } = req.body;
    const { database, presenters, user } = this.getTitles();

    const createWatchlist = new CreateWatchlist(
      database,
      user,
      name,
      privacity,
      description
    );

    let watchlist: Watchlist;

    try {
      watchlist = await createWatchlist.execute()
    } catch(error: any) {
      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.CREATED,
      data: presenters.presentWatchlist(watchlist)
    }
  }
}
