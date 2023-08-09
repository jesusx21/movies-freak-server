import { Monopoly } from '../../../boardGame';

import { TVSerieNotFound } from '../../../database/stores/errors';
import { HTTPInternalError, HTTPNotFound, OK } from '../../httpResponses';

export default class TVSerieResource extends Monopoly {
  async onGet({ params }) {
    const { tvSerieId } = params;
    const { database, presenters } = this.getTitles();

    let tvSerie;

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
