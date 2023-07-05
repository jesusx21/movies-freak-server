import { Film } from '../../../app/movies-freak/entities';
import { CREATED, HTTPInternalError } from '../../httpResponses';

export default class FilmResource {
  constructor(database, presenter) {
    this._database = database;
    this._presenter = presenter;
  }

  async onPost({ body }) {
    const film = new Film(body);
    
    let result;

    try {
      result = await this._database.films.create(film);
    } catch (error) {
      throw new HTTPInternalError(error);
    }
    
    return {
      status: CREATED,
      data: this._presenter.presentFilm(result)
    };
  }
}