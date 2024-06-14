var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Store from './store';
import { NotFound, TVEpisodeNotFound } from '../errors';
class InMemoryTVEpisodesStore {
    constructor() {
        this.store = new Store();
    }
    create(tvEpisode) {
        return this.store.create(tvEpisode);
    }
    findById(tvEpisodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.store.findById(tvEpisodeId);
            }
            catch (error) {
                if (error instanceof NotFound) {
                    throw new TVEpisodeNotFound(tvEpisodeId);
                }
                throw error;
            }
        });
    }
    findByTVSeasonId(tvSeasonId, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            options.query = { tvSeasonId };
            return this.store.find(options);
        });
    }
    countByTVSeasonId(tvSeasonId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.count({ tvSeasonId });
        });
    }
}
export default InMemoryTVEpisodesStore;
//# sourceMappingURL=tvEpisodes.js.map