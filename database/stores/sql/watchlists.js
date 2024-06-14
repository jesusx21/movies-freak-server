var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { omit } from 'lodash';
import { SQLDatabaseException } from './errors';
import { WatchlistSerializer } from './serializers';
class SQLWatchlistsStore {
    constructor(connection) {
        this.connection = connection;
    }
    create(watchlist) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToInsert = this.serialize(watchlist);
            let result;
            try {
                [result] = yield this.connection('watchlists')
                    .returning('*')
                    .insert(dataToInsert);
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            return this.deserialize(result);
        });
    }
    serialize(watchlist) {
        const data = WatchlistSerializer.toJSON(watchlist);
        return omit(data, ['total_films', 'total_tv_episodes']);
    }
    deserialize(data) {
        data.total_films = 0;
        data.total_tv_episodes = 0;
        return WatchlistSerializer.fromJSON(data);
    }
}
export default SQLWatchlistsStore;
//# sourceMappingURL=watchlists.js.map