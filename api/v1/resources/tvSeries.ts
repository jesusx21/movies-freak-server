import { Monopoly } from '../../../boardGame';
import { MultipleRespponse, SingleRespponse } from '../../../boardGame/monopoly';

import CreateTVSerie from '../../../app/moviesFreak/createTVSerie';
import { CREATED, HTTPInternalError, OK } from '../../httpResponses';
import { Titles } from '../interfaces';
import { TVSerie } from '../../../app/moviesFreak/entities';
import { QueryResponse } from '../../../database/stores/interfaces';

class TVSeriesResource extends Monopoly<Titles> {
  async onPost({ body }): Promise<SingleRespponse> {
    const { database, imdb, presenters } = this.getTitles();
    const useCase = new CreateTVSerie(database, imdb, body.imdbId);

    let result: TVSerie;

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

  async onGet({ query }): Promise<MultipleRespponse> {
    const skip = Number(query.skip || 0);
    const limit = Number(query.limit || 25);
    const { database, presenters } = this.getTitles();

    let result: QueryResponse<TVSerie>;

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

export default TVSeriesResource;
