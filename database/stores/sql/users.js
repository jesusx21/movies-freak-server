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
import { SQLDatabaseException } from './errors';
import { UserSerializer } from './serializers';
import { EmailAlreadyExists, UsernameAlreadyExists, UserNotFound } from '../errors';
class SQLUsersStore {
    constructor(connection) {
        this.connection = connection;
    }
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToInsert = this.serialize(user);
            let result;
            try {
                [result] = yield this.connection('users')
                    .returning('*')
                    .insert(dataToInsert);
            }
            catch (error) {
                if (error.constraint === 'users_email_unique') {
                    throw new EmailAlreadyExists();
                }
                if (error.constraint === 'users_username_unique') {
                    throw new UsernameAlreadyExists();
                }
                throw new SQLDatabaseException(error);
            }
            return this.deserialize(result);
        });
    }
    findById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ id: userId });
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ email });
        });
    }
    findByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOne({ username });
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.connection('users')
                    .where(query)
                    .first();
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            if (!result) {
                throw new UserNotFound(query);
            }
            return this.deserialize(result);
        });
    }
    serialize(user) {
        const result = UserSerializer.toJSON(user);
        return Object.assign(Object.assign({}, omit(result, ['id', 'created_at', 'updated_at'])), { password_hash: user.password.hash, password_salt: user.password.salt });
    }
    deserialize(data) {
        const user = UserSerializer.fromJSON(data);
        user.password = {
            hash: data.password_hash,
            salt: data.password_salt
        };
        return user;
    }
}
export default SQLUsersStore;
//# sourceMappingURL=users.js.map