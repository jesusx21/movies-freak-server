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
import { TVEpisodeNotFound } from '../errors';
import { TVEpisodeSerializer } from './serializers';
class SQLTVEpisodeStore {
    constructor(connection) {
        this.connection = connection;
    }
    create(tvEpisode) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToInsert = this.serialize(tvEpisode);
            let result;
            try {
                [result] = yield this.connection('tv_episodes')
                    .returning('*')
                    .insert(dataToInsert);
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            return this.deserialize(result);
        });
    }
    findById(tvEpisodeId) {
        return this.findOne({ id: tvEpisodeId });
    }
    findByTVSeasonId(tvSeasonId, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let items;
            try {
                const query = this.connection('tv_episodes')
                    .where('tv_season_id', tvSeasonId);
                if (options.skip) {
                    query.offset(options.skip);
                }
                if (options.limit) {
                    query.limit(options.limit);
                }
                items = yield query.orderBy('episode_number');
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            return {
                items: items.map(this.deserialize.bind(this)),
                totalItems: yield this.countByTvSeasonId(tvSeasonId)
            };
        });
    }
    countByTvSeasonId(tvSeasonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.connection('tv_episodes')
                    .where('tv_season_id', tvSeasonId)
                    .count()
                    .first();
                return Number(result === null || result === void 0 ? void 0 : result.count);
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.connection('tv_episodes')
                    .where(query)
                    .first();
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            if (!result) {
                throw new TVEpisodeNotFound(query);
            }
            return this.deserialize(result);
        });
    }
    serialize(tvEpisode) {
        return TVEpisodeSerializer.toJSON(tvEpisode);
    }
    deserialize(data) {
        return TVEpisodeSerializer.fromJSON(data);
    }
}
export default SQLTVEpisodeStore;
//# sourceMappingURL=tvEpisodes.js.map