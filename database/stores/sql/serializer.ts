import { isNil } from 'lodash';

export class SerializerError extends Error {}

export class MissingSchema extends SerializerError {
  constructor() {
    super('Schema has not been provided');
  }
}

interface fieldOptions {
  from?: string;
  as?: string;
}

interface fieldObject {
  name: string;
  options?: fieldOptions;
}

class Schema {
  private fields: string[];

  constructor() {
    this.fields = [];
  }

  addField(field: fieldObject) {
    this[field.name] = field.options;

    this.fields.push(field.name);
  }

  forEachField(callback: Function) {
    this.fields.forEach((field: string) => callback(field, this[field]));
  }
}

class Field {
  readonly name: string:
  readonly options: fieldOptions;

  constructor(name: string, options: fieldOptions = {}) {
    this.name = name;
    this.options = options;
  }
}

class Serializer<T> {
  private schema: Schema;
  private target: T | any;

  constructor(target: T) {
    this.target = target;
  }

  static init<D>(target: any) {
    return new Serializer<D>(target);
  }

  addSchema(...args: Field[]) {
    this.schema = new Schema();

    args.forEach((field: Field) => this.schema.addField(field));

    return this;
  }

  fromJSON(data: {}): T {
    if (!this.schema) {
      throw new MissingSchema();
    }

    const result = {};

    this.schema.forEachField((field, options) => {
      const key = options.from || field;
      let value = data[field];

      if (options.as === 'array') {
        value = value?.split(',');
      } else if (options.as === 'json') {
        value = value && JSON.parse(value);
      }

      result[key] = value;
    });

    return new this.target(result);
  }

  toJSON(entity: T) {
    if (!this.schema) {
      throw new MissingSchema();
    }

    const result = {};

    this.schema.forEachField((field: string, options: fieldOptions) => {
      const key = options.from || field;
      let value: any = entity[key];

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

export function field(name: string, options: fieldOptions = {}) {
  return new Field(name, options);
}

export default Serializer;
