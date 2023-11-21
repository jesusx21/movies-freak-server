import { Monopoly, SingleResponse } from '../../../boardGame';

import { HTTPInternalError, HTTPNotFound, OK } from '../../httpResponses';
import { Titles } from '../interfaces';
import { TVSerie } from '../../../app/moviesFreak/entities';
import { TVSerieNotFound } from '../../../database/stores/errors';

class TVSerieResource extends Monopoly<Titles> {
  async onGet({ params }): Promise<SingleResponse> {
    const { tvSerieId } = params;
    const { database, presenters } = this.getTitles();

    let tvSerie: TVSerie;

    try {
      tvSerie = await database.tvSeries.findById(tvSerieId);
    } catch (error) {
      if (error instanceof TVSerieNotFound) {
        throw new HTTPNotFound('TV_SERIE_NOT_FOUND');
      }

      throw new HTTPInternalError(error);
    }

    return {
      status: OK,
      data: presenters.presentTVSerie(tvSerie)
    };
  }
}

export default TVSerieResource;
