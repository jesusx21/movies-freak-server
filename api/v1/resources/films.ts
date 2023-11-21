import { Monopoly, MultipleRespponse, SingleResponse } from '../../../boardGame';

import CreateFilm from '../../../app/moviesFreak/createFilm';
import { CREATED, HTTPInternalError, OK } from '../../httpResponses';
import { Film } from '../../../app/moviesFreak/entities';
import { QueryResponse } from '../../../database/stores/interfaces';
import { Titles } from '../interfaces';

class FilmsResource extends Monopoly<Titles> {
  async onPost({ body }): Promise<SingleResponse> {
    const { database, imdb, presenters } = this.getTitles();
    const useCase = new CreateFilm(database, imdb, body.imdbId);

    let result: Film;

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

  async onGet({ query }): Promise<MultipleRespponse> {
    const { database, presenters } = this.getTitles();
    const skip = Number(query.skip || 0);
    const limit = Number(query.limit || 25);

    let result: QueryResponse<Film>;

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

export default FilmsResource;
