import Crypto from 'crypto';
import { isEmpty } from 'lodash';
import Entity from './entity';
import { ReadOnlyField, UserHasNotPassword } from './errors';
class User extends Entity {
    constructor(args) {
        super(args.id, args.createdAt, args.updatedAt);
        this.name = args.name;
        this.username = args.username;
        this.lastName = args.lastName;
        this.email = args.email;
        this.birthdate = args.birthdate;
        this._password = {};
    }
    get password() {
        return this._password;
    }
    set password(password) {
        if (!isEmpty(this._password)) {
            throw new ReadOnlyField('password');
        }
        this._password = password;
    }
    addPassword(password) {
        const salt = this.generateSalt();
        const hash = this.hashPassword(salt, password);
        this._password = { salt, hash };
    }
    doesPasswordMatch(password) {
        if (!this._password.salt) {
            throw new UserHasNotPassword();
        }
        const passwordHash = this.hashPassword(this._password.salt, password);
        return this._password.hash === passwordHash;
    }
    generateSalt() {
        return Crypto.randomBytes(8)
            .toString('hex');
    }
    hashPassword(salt, password) {
        const hash = Crypto.createHmac('sha512', salt);
        hash.update(password);
        return hash.digest('hex');
    }
}
export default User;
//# sourceMappingURL=user.js.map