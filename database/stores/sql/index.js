var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import SQLFilmsStore from './films';
import SQLMediaWatchlistsStore from './mediaWatchlist';
import SQLSessionsStore from './sessions';
import SQLTVEpisodeStore from './tvEpisodes';
import SQLTVSeasonStore from './tvSeason';
import SQLTVSeriesStore from './tvSeries';
import SQLUsersStore from './users';
import SQLWatchlistsStore from './watchlists';
class SQLDatabase {
    constructor(connection) {
        this.connection = connection;
        this.films = new SQLFilmsStore(this.connection);
        this.mediaWatchlists = new SQLMediaWatchlistsStore(this.connection, this);
        this.sessions = new SQLSessionsStore(this.connection, this);
        this.tvEpisodes = new SQLTVEpisodeStore(this.connection);
        this.tvSeasons = new SQLTVSeasonStore(this.connection);
        this.tvSeries = new SQLTVSeriesStore(this.connection);
        this.users = new SQLUsersStore(this.connection);
        this.watchlists = new SQLWatchlistsStore(this.connection);
    }
    withTransaction(fn, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.transaction();
            return fn(transaction, ...args);
        });
    }
    transaction() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.connection.transaction();
            yield connection.raw('SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;');
            return new SQLTransactionDatabase(connection);
        });
    }
}
class SQLTransactionDatabase extends SQLDatabase {
    commit(response) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.commit();
            return response;
        });
    }
    rollback(error) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connection.rollback();
            throw error;
        });
    }
}
export default SQLDatabase;
//# sourceMappingURL=index.js.map