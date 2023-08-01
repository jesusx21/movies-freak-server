import CreateFilm from '../../../app/moviesFreak/createFilm';
import { CREATED, HTTPInternalError } from '../../httpResponses';

export default class FilmsResource {
  constructor(database, imdb, presenter) {
    this._database = database;
    this._imdb = imdb;
    this._presenter = presenter;
  }

  async onPost({ body }) {
    const useCase = new CreateFilm(this._database, this._imdb, body.imdbId);

    let result;

    try {
      result = await useCase.execute();
    } catch (error) {
      throw new HTTPInternalError(error);
    }

    return {
      status: CREATED,
      data: this._presenter.presentFilm(result)
    };
  }
}
