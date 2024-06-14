var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CouldNotCreateFilm } from './errors';
import { Film } from './entities';
class CreateFilm {
    constructor(database, imdb, imdbId) {
        this.database = database;
        this.imdb = imdb;
        this.imdbId = imdbId;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let imdbResult;
            try {
                imdbResult = yield this.imdb.fetchFilmById(this.imdbId);
            }
            catch (error) {
                throw new CouldNotCreateFilm(error);
            }
            const film = this.buildFilmFromIMDBResult(imdbResult);
            try {
                return yield this.database.films.create(film);
            }
            catch (error) {
                throw new CouldNotCreateFilm(error);
            }
        });
    }
    buildFilmFromIMDBResult(imdbResult) {
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
//# sourceMappingURL=createFilm.js.map