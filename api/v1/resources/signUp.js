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
import Register from '../../../app/moviesFreak/signUp';
import { HTTPConflict, HTTPInternalError } from '../../httpResponses';
import { EmailAlreadyUsed, UsernameAlreadyUsed } from '../../../app/moviesFreak/errors';
class SignUp extends Monopoly {
    onPost({ body }) {
        return __awaiter(this, void 0, void 0, function* () {
            const database = this.getTitle('database');
            const signUp = new Register(database, body);
            let session;
            try {
                session = yield signUp.execute();
            }
            catch (error) {
                if (error instanceof EmailAlreadyUsed) {
                    throw new HTTPConflict('EMAIL_ALREADY_USED');
                }
                if (error instanceof UsernameAlreadyUsed) {
                    throw new HTTPConflict('USERNAME_ALREADY_USED');
                }
                throw new HTTPInternalError(error);
            }
            const presenter = this.getTitle('presenters');
            return {
                status: HTTPStatusCode.CREATED,
                data: presenter.presentSession(session)
            };
        });
    }
}
export default SignUp;
//# sourceMappingURL=signUp.js.map