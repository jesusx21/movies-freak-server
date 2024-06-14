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
import { Session, User } from './entities';
import { EmailAlreadyExists, UsernameAlreadyExists } from '../../database/stores/errors';
import { CouldNotSignUp, EmailAlreadyUsed, UsernameAlreadyUsed } from './errors';
class SignUp {
    constructor(database, userData) {
        this.database = database;
        this.userData = userData;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            let userCreated;
            try {
                const user = new User(omit(this.userData, 'password'));
                user.addPassword(this.userData.password);
                userCreated = yield this.database.users.create(user);
            }
            catch (error) {
                if (error instanceof EmailAlreadyExists) {
                    throw new EmailAlreadyUsed();
                }
                if (error instanceof UsernameAlreadyExists) {
                    throw new UsernameAlreadyUsed();
                }
                throw new CouldNotSignUp(error);
            }
            const session = new Session({ user: userCreated });
            session.generateToken()
                .activateToken();
            try {
                return yield this.database.sessions.create(session);
            }
            catch (error) {
                throw new CouldNotSignUp(error);
            }
        });
    }
}
export default SignUp;
//# sourceMappingURL=signUp.js.map