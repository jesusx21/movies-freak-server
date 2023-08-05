import CreateTVSerie from '../../../app/moviesFreak/createTVSerie';
import { CREATED, HTTPInternalError, OK } from '../../httpResponses';

export default class TVSeriesResource {
  constructor(database, imdb, presenter) {
    this._database = database;
    this._imdb = imdb;
    this._presenter = presenter;
  }

  async onPost({ body }) {
    const useCase = new CreateTVSerie(this._database, this._imdb, body.imdbId);

    let result;

    try {
      result = await useCase.execute();
    } catch (error) {
      throw new HTTPInternalError(error);
    }

    return {
      status: CREATED,
      data: this._presenter.presentTVSerie(result)
    };
  }

  async onGet({ query }) {
    const skip = Number(query.skip || 0);
    const limit = Number(query.limit || 25);

    let result;

    try {
      result = await this._database.tvSeries.find({ skip, limit });
    } catch (error) {
      throw new HTTPInternalError(error);
    }

    return {
      status: OK,
      data: {
        skip,
        limit,
        totalItems: result.totalItems,
        items: this._presenter.presentTVSeries(result.items)
      }
    };
  }
}
