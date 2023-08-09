import { Monopoly } from '../../../boardGame';

import CreateFilm from '../../../app/moviesFreak/createFilm';
import { CREATED, HTTPInternalError, OK } from '../../httpResponses';

export default class FilmsResource extends Monopoly {
  async onPost({ body }) {
    const { database, imdb, presenters } = this.getTitles();
    const useCase = new CreateFilm(database, imdb, body.imdbId);

    let result;

    try {
      result = await useCase.execute();
    } catch (error) {
      throw new HTTPInternalError(error);
    }

    return {
      status: CREATED,
      data: presenters.presentFilm(result)
    };
  }

  async onGet({ query }) {
    const { database, presenters } = this.getTitles();
    const skip = Number(query.skip || 0);
    const limit = Number(query.limit || 25);

    let result;

    try {
      result = await database.films.find({ skip, limit });
    } catch (error) {
      throw new HTTPInternalError(error);
    }

    return {
      status: OK,
      data: {
        skip,
        limit,
        totalItems: result.totalItems,
        items: presenters.presentFilms(result.items)
      }
    };
  }
}
