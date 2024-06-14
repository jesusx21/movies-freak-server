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
import { EmailAlreadyExists, NotFound, UserNotFound, UsernameAlreadyExists } from '../errors';
class InMemoryUsersStore {
    constructor() {
        this.store = new Store();
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.findByEmail(user.email);
                throw new EmailAlreadyExists();
            }
            catch (error) {
                if (!(error instanceof UserNotFound)) {
                    throw error;
                }
            }
            try {
                yield this.findByUsername(user.username);
                throw new UsernameAlreadyExists();
            }
            catch (error) {
                if (!(error instanceof UserNotFound)) {
                    throw error;
                }
            }
            return this.store.create(user);
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.store.findById(userId);
            }
            catch (error) {
                if (error instanceof NotFound) {
                    throw new UserNotFound({ id: userId });
                }
                throw error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.store.findOne({ email });
            }
            catch (error) {
                if (error instanceof NotFound) {
                    throw new UserNotFound({ email });
                }
                throw error;
            }
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.store.findOne({ username });
            }
            catch (error) {
                if (error instanceof NotFound) {
                    throw new UserNotFound({ username });
                }
                throw error;
            }
        });
    }
}
export default InMemoryUsersStore;
//# sourceMappingURL=users.js.map