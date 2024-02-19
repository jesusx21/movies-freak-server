import { Monopoly } from '../../../boardGame';
import {
  HTTPStatusCode,
  MultipleRespponse,
  Request,
  SingleResponse
} from '../../../boardGame/types';

import CreateTVSerie from '../../../app/moviesFreak/createTVSerie';
import { HTTPInternalError } from '../../httpResponses';
import { QueryResponse } from '../../../types/database';
import { TVSerie } from '../../../app/moviesFreak/entities';

class TVSeriesResource extends Monopoly {
  async onPost({ body }: Request): Promise<SingleResponse> {
    const { database, imdb, presenters } = this.getTitles();
    const useCase = new CreateTVSerie(database, imdb, body.imdbId);

    let result: TVSerie;

    try {
      result = await useCase.execute();
    } catch (error: any) {
      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.CREATED,
      data: presenters.presentTVSerie(result)
    };
  }

  async onGet({ query }: Request): Promise<MultipleRespponse> {
    const skip = Number(query.skip || 0);
    const limit = Number(query.limit || 25);
    const { database, presenters } = this.getTitles();

    let result: QueryResponse<TVSerie>;

    try {
      result = await database.tvSeries.find({ skip, limit });
    } catch (error: any) {
      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.OK,
      data: {
        skip,
        limit,
        totalItems: result.totalItems,
        items: presenters.presentTVSeries(result.items)
      }
    };
  }
}

export default TVSeriesResource;
