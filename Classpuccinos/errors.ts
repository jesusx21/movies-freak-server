import { ClasspuccinoErrorParams, Json } from './types';

export class ClasspuccinoError extends Error{
  readonly cause?: Json;
  readonly info?: Json;

  constructor(args: ClasspuccinoErrorParams = {}) {
    super(args.message || 'Something unexpected happened');

    this.cause = args.error;
    this.info = args.info || {};
  }

  get name() {
    return this.constructor.name;
  }
}

export class AssertionError extends ClasspuccinoError {
  constructor(message = 'Assertion Error') {
    super({ message });
  }
}

export class ClasspuccinoNotInitialized extends ClasspuccinoError {
  constructor() {
    super({ message: 'Classpuccino has not been initialized' });
  }
}

export class ClasspuccinoUnknownError extends ClasspuccinoError {
  constructor(error: Json) {
    super({ error });
  }
}
