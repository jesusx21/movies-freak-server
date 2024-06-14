import { ReadOnlyField } from './errors';
class Entity {
    constructor(id, createdAt, updatedAt) {
        this._id = id;
        this._createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        if (this._id) {
            throw new ReadOnlyField('id');
        }
        this._id = id;
    }
    get createdAt() {
        return this._createdAt;
    }
    set createdAt(date) {
        if (this._createdAt) {
            throw new ReadOnlyField('createdAt');
        }
        this._createdAt = date;
    }
}
export default Entity;
//# sourceMappingURL=entity.js.map