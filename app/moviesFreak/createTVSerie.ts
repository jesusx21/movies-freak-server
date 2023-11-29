/* eslint-disable no-await-in-loop */
import IMDB from '../imdb/gateways/dummy/dummyGateway';
import { Database } from '../../database';
import { Episode } from '../imdb/gateways/dummy/result/tvSeason';
import { TVEpisode, TVSeason, TVSerie } from './entities';
import {
  CouldNotCreateTVEpisodes,
  CouldNotCreateTVSeasons,
  CouldNotCreateTVSerie
} from './errors';

class CreateTVSerie {
  database: Database;
  imdb: IMDB;
  imdbId: string;

  constructor(database: Database, imdb: IMDB, imdbId: string) {
    this.database = database;
    this.imdb = imdb;
    this.imdbId = imdbId;
  }

  async execute(): Promise<TVSerie> {
    let imdbTVSerie: TVSerie;

    try {
      imdbTVSerie = await this.fetchTVSerieFromIMDB();
    } catch (error) {
      throw new CouldNotCreateTVSerie(error);
    }

    return this.database.withTransaction(async (database: Database) => {
      let tvSerie: TVSerie;

      try {
        tvSerie = await database.tvSeries.create(imdbTVSerie);
      } catch (error) {
        throw new CouldNotCreateTVSerie(error);
      }

      for (let seasonNumber = 1; seasonNumber <= tvSerie?.totalSeasons; seasonNumber += 1) {
        let result: {
          tvSeason: TVSeason;
          episodes: Episode[];
        };

        let tvSeason: TVSeason;

        try {
          result = await this.fetchTVSeasonFromIMDB(tvSerie, seasonNumber);
          tvSeason = await database.tvSeasons.create(result.tvSeason);
        } catch (error) {
          throw new CouldNotCreateTVSeasons(error);
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const episode of result.episodes) {
          try {
            const tvEpisode = await this.fetchTVEpisodenFromIMDB(tvSeason, episode);
            await database.tvEpisodes.create(tvEpisode);
          } catch (error) {
            throw new CouldNotCreateTVEpisodes(error);
          }
        }
      }

      return tvSerie;
    });
  }

  private async fetchTVSerieFromIMDB() {
    const result = await this.imdb.fetchTVSerieById(this.imdbId);

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

  private async fetchTVSeasonFromIMDB(tvSerie: TVSerie, seasonNumber: number) {
    const result = await this.imdb.fetchTVSeasonBySerieId(this.imdbId, seasonNumber);

    const tvSeason = new TVSeason({
      seasonNumber,
      tvSerieId: tvSerie.id,
      plot: tvSerie.plot,
      poster: tvSerie.poster
    });

    return { tvSeason, episodes: result.episodes };
  }

  private async fetchTVEpisodenFromIMDB(tvSeason: TVSeason, episode: Episode) {
    const result = await this.imdb.fetchTVEpisodeById(this.imdbId);

    return new TVEpisode({
      imdbId: episode.imdbId || result.imdbId,
      name: episode.title || result.title,
      year: episode.releasedDate.getFullYear(),
      seasonNumber: tvSeason.seasonNumber || result.numberOfSeason,
      episodeNumber: episode.numberOfEpisode || result.numberOfEpisode,
      genre: result.genre,
      director: result.director,
      writers: result.writers,
      actors: result.actors,
      plot: result.plot,
      languages: result.language,
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

export default CreateTVSerie;
