var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { cloneDeep, get as getKey } from 'lodash';
import { v4 as uuid } from 'uuid';
import { NotFound } from '../errors';
class Store {
    constructor() {
        this.items = {};
    }
    create(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            const entityToSave = cloneDeep(entity);
            const entityId = uuid();
            Object.assign(entityToSave, {
                _id: entityId,
                _createdAt: new Date(),
                _updatedAt: new Date()
            });
            this.items[entityId] = entityToSave;
            return cloneDeep(entityToSave);
        });
    }
    update(entity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!entity.id || !this.items[entity.id]) {
                throw new NotFound({ id: entity.id });
            }
            entity.updatedAt = new Date();
            this.items[entity.id] = cloneDeep(entity);
            return cloneDeep(entity);
        });
    }
    findById(entityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const entity = this.items[entityId];
            if (!entity) {
                throw new NotFound(entityId);
            }
            return cloneDeep(entity);
        });
    }
    find(options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = options.query || {};
            const items = Object.values(this.items);
            const skip = options.skip || 0;
            const limit = skip + (options.limit || items.length - 1);
            const result = applyFilter(items, query);
            return {
                items: result.slice(skip, limit),
                totalItems: yield this.count(query)
            };
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = Object.values(this.items)
                .sort((a, b) => b.createdAt - a.createdAt);
            const [entity] = applyFilter(items, query);
            if (!entity) {
                throw new NotFound(query);
            }
            return cloneDeep(entity);
        });
    }
    count(query = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = Object.values(this.items);
            return applyFilter(items, query)
                .length;
        });
    }
}
function applyFilter(data, filter) {
    const items = cloneDeep(data);
    return items.filter((item) => {
        return Object.keys(filter)
            .reduce((succeed, key) => succeed && getKey(filter, key) === getKey(item, key), true);
    });
}
export default Store;
//# sourceMappingURL=store.js.map