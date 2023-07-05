import { TVSerie } from './entities';
import { CouldNotCreateTVSerie } from './errors';

export default class CreateTVSerie {
  constructor(database, imdb, imdbId) {
    this._database = database;
    this._imdb = imdb;
    this._imdbId = imdbId;
  }

  async execute() {
    let imdbResult;

    try {
      imdbResult = await this._imdb.fetchTVSerieById(this._imdb);
    } catch (error) {
      throw new CouldNotCreateTVSerie(error);
    }

    const tvSerie = this._buildTVSeroeFromIMDBResult(imdbResult);

    try {
      return await this._database.tvSeries.create(tvSerie);
    } catch (error) {
      throw new CouldNotCreateTVSerie(error);
    }
  }

  _buildTVSeroeFromIMDBResult(imdbResult) {
    return new TVSerie({
      imdbId: imdbResult.imdbId,
      name: imdbResult.title,
      plot: imdbResult.plot,
      years: imdbResult.years,
      rated: imdbResult.rated,
      genre: imdbResult.genre,
      writers: imdbResult.writers,
      actors: imdbResult.actors,
      poster: imdbResult.poster,
      imdbRating: imdbResult.imdbRating,
      totalSeasons: imdbResult.totalSeasons,
      releasedAt: imdbResult.releasedAt
    });
  }
}
