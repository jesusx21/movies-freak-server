var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { omit, pick } from 'lodash';
import { SessionNotFound } from '../errors';
import { SessionSerializer } from './serializers';
import { SQLDatabaseException } from './errors';
class SQLSessionsStore {
    constructor(connection, database) {
        this.connection = connection;
        this.database = database;
    }
    create(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataToInsert = this.serialize(session);
            let result;
            try {
                [result] = yield this.connection('sessions')
                    .returning('*')
                    .insert(dataToInsert);
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            return this.deserialize(result);
        });
    }
    findActiveByUserId(userId) {
        return this.findOne({
            is_active: true,
            user_id: userId
        });
    }
    update(session) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.serialize(session);
            let result;
            try {
                [result] = yield this.connection('sessions')
                    .returning('*')
                    .where('id', session.id)
                    .update(Object.assign(Object.assign({}, pick(data, ['token', 'expires_at', 'is_active'])), { updated_at: new Date() }));
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            if (!result) {
                throw new SessionNotFound({ id: session.id });
            }
            return this.deserialize(result);
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                result = yield this.connection('sessions')
                    .where(query)
                    .orderBy('created_at', 'desc')
                    .first();
            }
            catch (error) {
                throw new SQLDatabaseException(error);
            }
            if (!result) {
                throw new SessionNotFound(query);
            }
            return this.deserialize(result);
        });
    }
    serialize(session) {
        var _a;
        const result = SessionSerializer.toJSON(session);
        result.is_active = session.isActive();
        result.expires_at = session.expiresAt;
        return Object.assign(Object.assign({}, omit(result, 'id')), { user_id: (_a = session.user) === null || _a === void 0 ? void 0 : _a.id });
    }
    deserialize(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = SessionSerializer.fromJSON(data);
            session.user = yield this.database.users.findById(data.user_id);
            return session;
        });
    }
}
export default SQLSessionsStore;
//# sourceMappingURL=sessions.js.map