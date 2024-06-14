import { isNil, get as getKey, set as setKey } from 'lodash';
export class SerializerError extends Error {
}
export class MissingSchema extends SerializerError {
    constructor() {
        super('Schema has not been provided');
    }
}
export class Schema {
    constructor() {
        this.fields = [];
    }
    addField(field) {
        setKey(this, field.name, field.options);
        this.fields.push(field.name);
    }
    getField(fieldName) {
        return getKey(this, fieldName);
    }
    forEachField(callback) {
        this.fields.forEach((field) => callback(field, getKey(this, field)));
    }
}
class Field {
    constructor(name, options = {}) {
        this.name = name;
        this.options = options;
    }
}
class Serializer {
    constructor(target) {
        this.target = target;
    }
    static init(target) {
        return new Serializer(target);
    }
    addSchema(...args) {
        this.schema = new Schema();
        args.forEach((field) => { var _a; return (_a = this.schema) === null || _a === void 0 ? void 0 : _a.addField(field); });
        return this;
    }
    fromJSON(data) {
        if (!this.schema) {
            throw new MissingSchema();
        }
        const result = {};
        this.schema.forEachField((field, options) => {
            const key = options.from || field;
            let value = getKey(data, field);
            if (options.as === 'array') {
                value = value === null || value === void 0 ? void 0 : value.split(',');
            }
            else if (options.as === 'json') {
                value = value && JSON.parse(value);
            }
            result[key] = value;
        });
        return new this.target(result);
    }
    toJSON(entity) {
        if (!this.schema) {
            throw new MissingSchema();
        }
        const result = {};
        this.schema.forEachField((field, options) => {
            const key = options.from || field;
            let value = getKey(entity, key);
            if (isNil(value)) {
                value = undefined;
            }
            else if (options.as === 'array') {
                value = value.join(',');
            }
            else if (options.as === 'json') {
                value = value && JSON.stringify(value);
            }
            result[field] = value;
        });
        return result;
    }
}
export function field(name, options = {}) {
    return new Field(name, options);
}
export default Serializer;
//# sourceMappingURL=serializer.js.map