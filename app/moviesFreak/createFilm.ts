import { CouldNotCreateFilm } from './errors';
import { Database } from '../../types/database';
import { Film } from './entities';
import { FilmResult, IMDBGateway } from '../../types/app';

class CreateFilm {
  database: Database;
  imdb: IMDBGateway;
  imdbId: string;

  constructor(database: Database, imdb: IMDBGateway, imdbId: string) {
    this.database = database;
    this.imdb = imdb;
    this.imdbId = imdbId;
  }

  async execute() {
    let imdbResult: FilmResult;

    try {
      imdbResult = await this.imdb.fetchFilmById(this.imdbId);
    } catch (error: any) {
      throw new CouldNotCreateFilm(error);
    }

    const film = this.buildFilmFromIMDBResult(imdbResult);

    try {
      return await this.database.films.create(film);
    } catch (error: any) {
      throw new CouldNotCreateFilm(error);
    }
  }

  private buildFilmFromIMDBResult(imdbResult: FilmResult) {
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

export default CreateFilm;
