var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MediaWatchlistSerializer } from './serializers';
import { SQLDatabaseException } from './errors';
class SQLMediaWatchlistsStore {
    constructor(connection, database) {
        this.connection = connection;
        this.database = database;
    }
    create(mediaWatchlist) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToInsert = this.serialize(mediaWatchlist);
            let result;
            try {
                [result] = yield this.connection('media_watchlists')
                    .returning('*')
                    .insert(dataToInsert);
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            return this.deserialize(result);
        });
    }
    serialize(mediaWatchlist) {
        return MediaWatchlistSerializer.toJSON(mediaWatchlist);
    }
    deserialize(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const mediaWatchlist = MediaWatchlistSerializer.fromJSON(data);
            if (mediaWatchlist.mediaType === 'film') {
                mediaWatchlist.film = yield this.database
                    .films
                    .findById(mediaWatchlist.filmId);
            }
            else if (mediaWatchlist.mediaType === 'tvEpisode') {
                mediaWatchlist.tvEpisode = yield this.database
                    .tvEpisodes
                    .findById(mediaWatchlist.tvEpisodeId);
            }
            return mediaWatchlist;
        });
    }
}
export default SQLMediaWatchlistsStore;
//# sourceMappingURL=mediaWatchlist.js.map