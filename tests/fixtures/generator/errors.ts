export class GeneratorErrors extends Error {
  get name() {
    return this.constructor.name;
  }
}

export class SchemaValidationFails extends GeneratorErrors {
  public cause: any;

  constructor(cause: any) {
    super();

    this.cause = cause;
  };
}

export class FixtureSchemaNotSet extends GeneratorErrors {
  public type: string;

  constructor(type: string) {
    super();

    this.type = type;
  }
}
