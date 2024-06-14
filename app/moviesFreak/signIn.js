var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Session } from './entities';
import { CouldNotSignIn, InvalidPassword, UserNotFound } from './errors';
import { UserNotFound as DatabaseUserNotFound, SessionNotFound } from '../../database/stores/errors';
class SignIn {
    constructor(database, username, password) {
        this.database = database;
        this.username = username;
        this.password = password;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield this.findUserByEmail();
            if (!user) {
                user = yield this.findUserByUsername();
            }
            if (!user || !user.id) {
                throw new UserNotFound();
            }
            if (!user.doesPasswordMatch(this.password)) {
                throw new InvalidPassword(this.password);
            }
            let session;
            try {
                session = yield this.database.sessions.findActiveByUserId(user.id);
            }
            catch (error) {
                if (!(error instanceof SessionNotFound)) {
                    throw new CouldNotSignIn(error);
                }
                session = new Session({ user });
            }
            session.generateToken()
                .activateToken();
            try {
                if (session.id) {
                    return yield this.database.sessions.update(session);
                }
                return yield this.database.sessions.create(session);
            }
            catch (error) {
                throw new CouldNotSignIn(error);
            }
        });
    }
    // eslint-disable-next-line consistent-return
    findUserByEmail() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.database.users.findByEmail(this.username);
            }
            catch (error) {
                if (!(error instanceof DatabaseUserNotFound)) {
                    throw new CouldNotSignIn(error);
                }
            }
        });
    }
    // eslint-disable-next-line consistent-return
    findUserByUsername() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.database.users.findByUsername(this.username);
            }
            catch (error) {
                if (!(error instanceof DatabaseUserNotFound)) {
                    throw new CouldNotSignIn(error);
                }
            }
        });
    }
}
export default SignIn;
//# sourceMappingURL=signIn.js.map