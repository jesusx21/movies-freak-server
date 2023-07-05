import { Film } from './entities';
import { CouldNotCreateFilm } from './errors';

export default class CreateFilm {
  constructor(database, imdb, imdbId) {
    this._database = database;
    this._imdb = imdb;
    this._imdbId = imdbId;
  }

  async execute() {
    let imdbResult;

    try {
      imdbResult = await this._imdb.fetchFilmById(this._imdbId);
    } catch (error) {
      throw new CouldNotCreateFilm(error);
    }

    const film = this._buildFilmFromIMDBResult(imdbResult);

    try {
      return await this._database.films.create(film);
    } catch (error) {
      throw new CouldNotCreateFilm(error);
    }
  }

  _buildFilmFromIMDBResult(imdbResult) {
    return new Film({
      name: imdbResult.title,
      plot: imdbResult.plot,
      title: imdbResult.title,
      year: imdbResult.year,
      rated: imdbResult.rated,
      runtime: imdbResult.runtime,
      director: imdbResult.director,
      poster: imdbResult.poster,
      production: imdbResult.production,
      genre: imdbResult.genre,
      writers: imdbResult.writers,
      actors: imdbResult.actors,
      imdbId: imdbResult.imdbId,
      imdbRating: imdbResult.imdbRating
    });
  }
}
