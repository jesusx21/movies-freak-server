var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Monopoly } from '../../../boardGame';
import { HTTPStatusCode } from '../../../boardGame/types';
import Login from '../../../app/moviesFreak/signIn';
import { InvalidPassword, UserNotFound } from '../../../app/moviesFreak/errors';
import { HTTPConflict, HTTPInternalError, HTTPNotFound } from '../../httpResponses';
class SignIn extends Monopoly {
    onPost({ body }) {
        return __awaiter(this, void 0, void 0, function* () {
            const database = this.getTitle('database');
            const login = new Login(database, body.username, body.password);
            let session;
            try {
                session = yield login.execute();
            }
            catch (error) {
                if (error instanceof UserNotFound) {
                    throw new HTTPNotFound('USER_NOT_FOUND');
                }
                if (error instanceof InvalidPassword) {
                    throw new HTTPConflict('PASSWORD_DOES_NOT_MATCH');
                }
                throw new HTTPInternalError(error);
            }
            const presenter = this.getTitle('presenters');
            return {
                status: HTTPStatusCode.OK,
                data: presenter.presentSession(session)
            };
        });
    }
}
export default SignIn;
//# sourceMappingURL=signIn.js.map