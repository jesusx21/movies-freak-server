var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SQLDatabaseException } from './errors';
import { TVSeasonNotFound } from '../errors';
import { TVSeasonSerializer } from './serializers';
class SQLTVSeasonStore {
    constructor(connection) {
        this.connection = connection;
    }
    create(tvSeason) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToInsert = this.serialize(tvSeason);
            let result;
            try {
                [result] = yield this.connection('tv_seasons')
                    .returning('*')
                    .insert(dataToInsert);
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            return this.deserialize(result);
        });
    }
    findById(tvSeasonId) {
        return this.findOne({ id: tvSeasonId });
    }
    findByTVSerieId(tvSerieId, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let items;
            try {
                const query = this.connection('tv_seasons')
                    .where('tv_serie_id', tvSerieId);
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
                totalItems: yield this.countByTvSerieId(tvSerieId)
            };
        });
    }
    countByTvSerieId(tvSerieId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.connection('tv_seasons')
                    .where('tv_serie_id', tvSerieId)
                    .count()
                    .first();
                return Number(result === null || result === void 0 ? void 0 : result.count);
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
                result = yield this.connection('tv_seasons')
                    .where(query)
                    .first();
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            if (!result) {
                throw new TVSeasonNotFound(query);
            }
            return this.deserialize(result);
        });
    }
    serialize(tvSeason) {
        return TVSeasonSerializer.toJSON(tvSeason);
    }
    deserialize(data) {
        return TVSeasonSerializer.fromJSON(data);
    }
}
export default SQLTVSeasonStore;
//# sourceMappingURL=tvSeason.js.map