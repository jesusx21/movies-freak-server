import { isNil, get as getKey, set as setKey } from 'lodash';

import { FieldObject, FieldOptions } from '../../../types/serializer';
import { Json } from '../../../types/common';

export class SerializerError extends Error {}

export class MissingSchema extends SerializerError {
  constructor() {
    super('Schema has not been provided');
  }
}

export class Schema {
  private fields: string[];

  constructor() {
    this.fields = [];
  }

  addField(field: FieldObject) {
    setKey(this, field.name, field.options)

    this.fields.push(field.name);
  }

  getField(fieldName: string) {
    return getKey(this, fieldName)
  }

  forEachField(callback: Function) {
    this.fields.forEach((field: string) => callback(field, getKey(this, field)));
  }
}

class Field {
  readonly name: string;
  readonly options: FieldOptions;

  constructor(name: string, options: FieldOptions = {}) {
    this.name = name;
    this.options = options;
  }
}

class Serializer<T> {
  schema?: Schema;
  private target: T | any;

  constructor(target: T) {
    this.target = target;
  }

  static init<D>(target: any) {
    return new Serializer<D>(target);
  }

  addSchema(...args: Field[]) {
    this.schema = new Schema();

    args.forEach((field: Field) => this.schema?.addField(field));

    return this;
  }

  fromJSON(data: {}): T {
    if (!this.schema) {
      throw new MissingSchema();
    }

    const result: Json = {};

    this.schema.forEachField((field: string, options: FieldOptions) => {
      const key = options.from || field;
      let value = getKey(data, field);

      if (options.as === 'array') {
        value = value?.split(',');
      } else if (options.as === 'json') {
        value = value && JSON.parse(value);
      }

      result[key] = value;
    });

    return new this.target(result);
  }

  toJSON(entity: T | Json): Json {
    if (!this.schema) {
      throw new MissingSchema();
    }

    const result: Json = {};

    this.schema.forEachField((field: string, options: FieldOptions) => {
      const key = options.from || field;
      let value = getKey(entity, key);

      if (isNil(value)) {
        value = undefined;
      } else if (options.as === 'array') {
        value = value.join(',');
      } else if (options.as === 'json') {
        value = value && JSON.stringify(value);
      }

      result[field] = value;
    });

    return result;
  }
}

export function field(name: string, options: FieldOptions = {}) {
  return new Field(name, options);
}

export default Serializer;
