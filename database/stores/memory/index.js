var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import InMemoryFilmsStore from './films';
import InMemorySessionsStore from './session';
import InMemoryTVEpisodesStore from './tvEpisodes';
import InMemoryTVSeasonStore from './tvSeasons';
import InMemoryTVSeriesStore from './tvSeries';
import InMemoryUsersStore from './users';
import InMemoryWatchlistStore from './watchlists';
class InMemoryDatabase {
    constructor() {
        this.films = new InMemoryFilmsStore();
        this.sessions = new InMemorySessionsStore();
        this.tvEpisodes = new InMemoryTVEpisodesStore();
        this.tvSeasons = new InMemoryTVSeasonStore();
        this.tvSeries = new InMemoryTVSeriesStore();
        this.users = new InMemoryUsersStore();
        this.watchlists = new InMemoryWatchlistStore();
    }
    withTransaction(fn, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return fn(this, ...args);
        });
    }
}
export default InMemoryDatabase;
//# sourceMappingURL=index.js.map