import { Monopoly, SingleResponse } from '../../../boardGame';

import { HTTPInternalError, HTTPNotFound, OK } from '../../httpResponses';
import { Film } from '../../../app/moviesFreak/entities';
import { FilmNotFound } from '../../../database/stores/errors';
import { Titles } from '../interfaces';
import { UUID } from '../../../typescript/customTypes';

class FilmResource extends Monopoly<Titles> {
  async onGet({ params }): Promise<SingleResponse> {
    const { database, presenters } = this.getTitles();
    const { filmId }: { filmId: UUID} = params;

    let film: Film;

    try {
      film = await database.films.findById(filmId);
    } catch (error) {
      if (error instanceof FilmNotFound) {
        throw new HTTPNotFound('FILM_NOT_FOUND');
      }

      throw new HTTPInternalError(error);
    }

    return {
      status: OK,
      data: presenters.presentFilm(film)
    };
  }
}

export default FilmResource;
