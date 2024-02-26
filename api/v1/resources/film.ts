import { HTTPStatusCode, Request, SingleResponse } from '../../../boardGame/types';
import { Monopoly } from '../../../boardGame';

import { HTTPInternalError, HTTPNotFound } from '../../httpResponses';
import { Film } from '../../../app/moviesFreak/entities';
import { FilmNotFound } from '../../../database/stores/errors';
import { UUID } from '../../../types/common';

interface FilmRequest extends Request {
  params: {
    filmId: UUID
  }
}

class FilmResource extends Monopoly {
  async onGet(req: FilmRequest): Promise<SingleResponse> {
    const { database, presenters } = this.getDependencies();
    const { filmId }= req.params;

    let film: Film;

    try {
      film = await database.films.findById(filmId);
    } catch (error: any) {
      if (error instanceof FilmNotFound) {
        throw new HTTPNotFound('FILM_NOT_FOUND');
      }

      throw new HTTPInternalError(error);
    }

    return {
      status: HTTPStatusCode.OK,
      data: presenters.presentFilm(film)
    };
  }
}

export default FilmResource;
