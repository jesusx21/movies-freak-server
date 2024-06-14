var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { TVEpisode, TVSeason, TVSerie } from './entities';
import { CouldNotCreateTVEpisodes, CouldNotCreateTVSeasons, CouldNotCreateTVSerie } from './errors';
class CreateTVSerie {
    constructor(database, imdb, imdbId) {
        this.database = database;
        this.imdb = imdb;
        this.imdbId = imdbId;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let imdbTVSerie;
            try {
                imdbTVSerie = yield this.fetchTVSerieFromIMDB();
            }
            catch (error) {
                throw new CouldNotCreateTVSerie(error);
            }
            return this.database.withTransaction((database) => __awaiter(this, void 0, void 0, function* () {
                let tvSerie;
                try {
                    tvSerie = yield database.tvSeries.create(imdbTVSerie);
                }
                catch (error) {
                    throw new CouldNotCreateTVSerie(error);
                }
                for (let seasonNumber = 1; seasonNumber <= (tvSerie === null || tvSerie === void 0 ? void 0 : tvSerie.totalSeasons); seasonNumber += 1) {
                    let result;
                    let tvSeason;
                    try {
                        result = yield this.fetchTVSeasonFromIMDB(tvSerie, seasonNumber);
                        tvSeason = yield database.tvSeasons.create(result.tvSeason);
                    }
                    catch (error) {
                        throw new CouldNotCreateTVSeasons(error);
                    }
                    // eslint-disable-next-line no-restricted-syntax
                    for (const episode of result.episodes) {
                        try {
                            const tvEpisode = yield this.fetchTVEpisodenFromIMDB(tvSeason, episode);
                            yield database.tvEpisodes.create(tvEpisode);
                        }
                        catch (error) {
                            throw new CouldNotCreateTVEpisodes(error);
                        }
                    }
                }
                return tvSerie;
            }));
        });
    }
    fetchTVSerieFromIMDB() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.imdb.fetchTVSerieById(this.imdbId);
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
        });
    }
    fetchTVSeasonFromIMDB(tvSerie, seasonNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.imdb.fetchTVSeasonBySerieId(this.imdbId, seasonNumber);
            const tvSeason = new TVSeason({
                seasonNumber,
                tvSerieId: tvSerie.id,
                plot: tvSerie.plot,
                poster: tvSerie.poster
            });
            return { tvSeason, episodes: result.episodes };
        });
    }
    fetchTVEpisodenFromIMDB(tvSeason, episode) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.imdb.fetchTVEpisodeById(this.imdbId);
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
        });
    }
}
export default CreateTVSerie;
//# sourceMappingURL=createTVSerie.js.map