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
import { NotFound, TVSeasonNotFound } from '../errors';
class InMemoryTVSeasonStore {
    constructor() {
        this.store = new Store();
    }
    create(tvSeason) {
        return this.store.create(tvSeason);
    }
    findById(tvSeasonId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.store.findById(tvSeasonId);
            }
            catch (error) {
                if (error instanceof NotFound) {
                    throw new TVSeasonNotFound(tvSeasonId);
                }
                throw error;
            }
        });
    }
    findByTVSerieId(tvSerieId, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            options.query = { tvSerieId };
            return this.store.find(options);
        });
    }
    countByTVSerieId(tvSerieId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.store.count({ tvSerieId });
        });
    }
}
export default InMemoryTVSeasonStore;
//# sourceMappingURL=tvSeasons.js.map