import { HTTPInternalError, HTTPNotFound, OK } from '../../httpResponses';
import { FilmNotFound } from '../../../database/stores/errors';

export default class FilmResource {
  constructor(database, presenter) {
    this._database = database;
    this._presenter = presenter;
  }

  async onGet({ params }) {
    const { filmId } = params;

    let film;

    try {
      film = await this._database.films.findById(filmId);
    } catch (error) {
      if (error instanceof FilmNotFound) {
        throw new HTTPNotFound('FILM_NOT_FOUND');
      }

      throw new HTTPInternalError(error);
    }

    return {
      status: OK,
      data: this._presenter.presentFilm(film)
    };
  }
}
