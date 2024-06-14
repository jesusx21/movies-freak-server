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
import { FilmNotFound, NotFound } from '../errors';
class InMemoryFilmsStore {
    constructor() {
        this.store = new Store();
    }
    create(film) {
        return this.store.create(film);
    }
    findById(filmId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.store.findById(filmId);
            }
            catch (error) {
                if (error instanceof NotFound) {
                    throw new FilmNotFound(filmId);
                }
                throw error;
            }
        });
    }
    find(options = {}) {
        return this.store.find(options);
    }
}
export default InMemoryFilmsStore;
//# sourceMappingURL=films.js.map