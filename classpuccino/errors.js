import { VError } from 'verror';

export class ClasspuccinoError extends VError {
  get name() {
    return this.constructor.name;
  }
}

export class AssertionError extends ClasspuccinoError {
  constructor(message = 'Assertion Error') {
    super(message);
  }
}
