import { Monopoly } from '../../../boardGame';
import {
  HTTPStatusCode,
  MultipleResponse,
  Request,
  SingleResponse
} from '../../../boardGame/types';

import CreateFilm from '../../../app/moviesFreak/createFilm';
import { HTTPInternalError } from '../../httpResponses';
import { Film } from '../../../app/moviesFreak/entities';
import { QueryResponse } from '../../../types/database';

class FilmsResource extends Monopoly {
  async onPost(request: Request): Promise<SingleResponse> {
    const { database, imdb, presenters } = this.getDependencies();
    const useCase = new CreateFilm(database, imdb, request.body.imdbId);

    let result: Film;

    try {
      result = await useCase.execute();
    } catch (error: any) {
      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.CREATED,
      data: presenters.presentFilm(result)
    };
  }

  async onGet({ query }: Request): Promise<MultipleResponse> {
    const { database, presenters } = this.getDependencies();
    const skip = Number(query.skip || 0);
    const limit = Number(query.limit || 25);

    let result: QueryResponse<Film>;

    try {
      result = await database.films.find({ skip, limit });
    } catch (error: any) {
      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.OK,
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
