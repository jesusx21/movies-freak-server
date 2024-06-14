var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FilmNotFound, IMDBIdAlreadyExists } from '../errors';
import { FilmSerializer } from './serializers';
import { SQLDatabaseException } from './errors';
class SQLFilmsStore {
    constructor(connection) {
        this.connection = connection;
    }
    create(film) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToInsert = this.serialize(film);
            let result;
            try {
                [result] = yield this.connection('films')
                    .returning('*')
                    .insert(dataToInsert);
            }
            catch (error) {
                if (error.constraint === 'films_imdb_id_unique') {
                    throw new IMDBIdAlreadyExists(film.imdbId);
                }
                throw new SQLDatabaseException(error);
            }
            return this.deserialize(result);
        });
    }
    findById(filmId) {
        return this.findOne({ id: filmId });
    }
    find(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let items;
            try {
                const query = this.connection('films');
                if (options.skip) {
                    query.offset(options.skip);
                }
                if (options.limit) {
                    query.limit(options.limit);
                }
                items = yield query.orderBy('created_at');
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            return {
                items: items.map(this.deserialize.bind(this)),
                totalItems: yield this.count()
            };
        });
    }
    count() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.connection('films')
                    .count()
                    .first();
                if (!result) {
                    return 0;
                }
                return Number(result.count);
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
        });
    }
    findOne(query = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.connection('films')
                    .where(query)
                    .first();
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            if (!result) {
                throw new FilmNotFound(query);
            }
            return this.deserialize(result);
        });
    }
    serialize(film) {
        return FilmSerializer.toJSON(film);
    }
    deserialize(data) {
        return FilmSerializer.fromJSON(data);
    }
}
export default SQLFilmsStore;
//# sourceMappingURL=films.js.map