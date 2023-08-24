/* eslint-disable no-await-in-loop */
import { TVEpisode, TVSeason, TVSerie } from './entities';
import {
  CouldNotCreateTVEpisodes,
  CouldNotCreateTVSeasons,
  CouldNotCreateTVSerie
} from './errors';

export default class CreateTVSerie {
  constructor(database, imdb, imdbId) {
    this._database = database;
    this._imdb = imdb;
    this._imdbId = imdbId;
  }

  async execute() {
    let imdbTVSerie;

    try {
      imdbTVSerie = await this._fetchTVSerieFromIMDB();
    } catch (error) {
      throw new CouldNotCreateTVSerie(error);
    }

    let tvSerie;

    await this._database.withTransaction(async (database) => {
      try {
        tvSerie = await database.tvSeries.create(imdbTVSerie);
      } catch (error) {
        throw new CouldNotCreateTVSerie(error);
      }

      for (let seasonNumber = 1; seasonNumber <= tvSerie.totalSeasons; seasonNumber += 1) {
        let result;
        let tvSeason;

        try {
          result = await this._fetchTVSeasonFromIMDB(tvSerie, seasonNumber);
          tvSeason = await database.tvSeasons.create(result.tvSeason);
        } catch (error) {
          throw new CouldNotCreateTVSeasons(error);
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const episode of result.episodes) {
          try {
            const tvEpisode = await this._fetchTVEpisodenFromIMDB(tvSeason, episode);
            await database.tvEpisodes.create(tvEpisode);
          } catch (error) {
            throw new CouldNotCreateTVEpisodes(error);
          }
        }
      }
    });

    return tvSerie;
  }

  async _fetchTVSerieFromIMDB() {
    const result = await this._imdb.fetchTVSerieById(this._imdbId);

    return new TVSerie({
      imdbId: result.imdbId,
      name: result.title,
      plot: result.plot,
      years: result.years,
      rated: result.rated,
      genre: result.genre,
      writers: result.writers,
      actors: result.actors,
      poster: result.poster,
      imdbRating: result.imdbRating,
      totalSeasons: result.totalSeasons,
      releasedAt: result.releasedAt
    });
  }

  async _fetchTVSeasonFromIMDB(tvSerie, seasonNumber) {
    const result = await this._imdb.fetchTVSeasonBySerieId(this._imdbId, seasonNumber);

    const tvSeason = new TVSeason({
      seasonNumber,
      tvSerieId: tvSerie.id,
      plot: result.plot || tvSerie.plot,
      poster: result.poster || tvSerie.poster
    });

    return { tvSeason, episodes: result.episodes };
  }

  async _fetchTVEpisodenFromIMDB(tvSeason, episode) {
    const result = await this._imdb.fetchTVEpisodeById(this._imdbId);

    return new TVEpisode({
      imdbId: episode.imdbId || result.imdbId,
      name: episode.title || result.title,
      year: episode.releasedDate.getFullYear(),
      seasonNumber: tvSeason.seasonNumber || result.seasonNumber,
      episodeNumber: episode.numberOfEpisode || result.episodeNumber,
      genre: result.genre,
      director: result.director,
      writers: result.writers,
      actors: result.actors,
      plot: result.plot,
      languages: result.languages,
      country: result.country,
      poster: result.poster,
      awards: result.awards,
      imdbRating: result.imdbRating,
      releasedAt: episode.releasedDate,
      tvSerieId: tvSeason.tvSerieId,
      tvSeasonId: tvSeason.id
    });
  }
}
