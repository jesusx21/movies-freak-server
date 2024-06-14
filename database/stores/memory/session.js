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
import { NotFound, SessionNotFound } from '../errors';
class InMemorySessionsStore {
    constructor() {
        this.store = new Store();
    }
    create(session) {
        return this.store.create(session);
    }
    findActiveByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.store.findOne({ 'user.id': userId });
            }
            catch (error) {
                if (error instanceof NotFound) {
                    throw new SessionNotFound(userId);
                }
                throw error;
            }
        });
    }
    update(session) {
        return __awaiter(this, void 0, void 0, function* () {
            let sessionToUpdate;
            try {
                return yield this.store.update(session);
            }
            catch (error) {
                if (error instanceof NotFound) {
                    throw new SessionNotFound({ id: session.id });
                }
                throw error;
            }
        });
    }
}
export default InMemorySessionsStore;
//# sourceMappingURL=session.js.map