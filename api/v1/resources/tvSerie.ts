import { Monopoly } from '../../../boardGame';
import { HTTPStatusCode, Request, SingleResponse } from '../../../boardGame/types';

import { HTTPInternalError, HTTPNotFound } from '../../httpResponses';
import { TVSerie } from '../../../app/moviesFreak/entities';
import { TVSerieNotFound } from '../../../database/stores/errors';

class TVSerieResource extends Monopoly {
  async onGet({ params }: Request): Promise<SingleResponse> {
    const { tvSerieId } = params;
    const { database, presenters } = this.getTitles();

    let tvSerie: TVSerie;

    try {
      tvSerie = await database.tvSeries.findById(tvSerieId);
    } catch (error: any) {
      if (error instanceof TVSerieNotFound) {
        throw new HTTPNotFound('TV_SERIE_NOT_FOUND');
      }

      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.OK,
      data: presenters.presentTVSerie(tvSerie)
    };
  }
}

export default TVSerieResource;
