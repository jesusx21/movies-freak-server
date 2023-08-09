import { Monopoly } from '../../../boardGame';

import CreateTVSerie from '../../../app/moviesFreak/createTVSerie';
import { CREATED, HTTPInternalError, OK } from '../../httpResponses';

export default class TVSeriesResource extends Monopoly {
  async onPost({ body }) {
    const { database, imdb, presenters } = this.getTitles();
    const useCase = new CreateTVSerie(database, imdb, body.imdbId);

    let result;

    try {
      result = await useCase.execute();
    } catch (error) {
      throw new HTTPInternalError(error);
    }

    return {
      status: CREATED,
      data: presenters.presentTVSerie(result)
    };
  }

  async onGet({ query }) {
    const skip = Number(query.skip || 0);
    const limit = Number(query.limit || 25);
    const { database, presenters } = this.getTitles();

    let result;

    try {
      result = await database.tvSeries.find({ skip, limit });
    } catch (error) {
      throw new HTTPInternalError(error);
    }

    return {
      status: OK,
      data: {
        skip,
        limit,
        totalItems: result.totalItems,
        items: presenters.presentTVSeries(result.items)
      }
    };
  }
}
