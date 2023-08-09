import { Monopoly } from '../../../boardGame';

import { FilmNotFound } from '../../../database/stores/errors';
import { HTTPInternalError, HTTPNotFound, OK } from '../../httpResponses';

export default class FilmResource extends Monopoly {
  async onGet({ params }) {
    const { database, presenters } = this.getTitles();
    const { filmId } = params;

    let film;

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
