import { difference, isEqual, isNil, isPlainObject } from 'lodash';
import { AssertionError } from './errors';

export default class Assertions {
  assertThat(actual) {
    this._actual = actual;

    return this;
  }

  isGreaterThan(expected) {
    if (this._actual > expected) {
      return true;
    }

    throw new AssertionError(
      `Expect actual (${this._actual}) to be greater than expected (${expected})`
    );
  }

  isLessThanOrEqual(expected) {
    if (this._actual <= expected) {
      return true;
    }

    throw new AssertionError(
      `Expect actual (${this._actual}) to be less than or equal to expected (${expected})`
    );
  }

  isEqual(expected) {
    if (isEqual(this._actual, expected)) {
      return true;
    }

    throw new AssertionError(
      `Expected ${this._actual} to be equal to ${expected}`
    );
  }

  isNotEqual(expected) {
    if (!isEqual(this._actual, expected)) {
      return true;
    }

    throw new AssertionError(
      `Expected ${this._actual} to not be equal to ${expected}`
    );
  }

  isEmpty() {
    if (Object.values(this._actual).length === 0) {
      return true;
    }

    throw new AssertionError(
      `Expected ${typeof this._actual} to be empty`
    );
  }

  isInstanceOf(klass) {
    if (this._actual instanceof klass) {
      return true;
    }

    throw new AssertionError(
      `Expected value to be instance of ${klass}`
    );
  }

  async willBeRejectedWith(errorKlass) {
    try {
      await this._actual;

      throw new AssertionError('Expected async function to be rejected, but was successful');
    } catch (error) {
      if (error instanceof errorKlass) {
        return error;
      }

      if (error instanceof AssertionError) {
        throw error;
      }

      throw new AssertionError(
        `Expected async function to be rejected with ${errorKlass.name} `
          + `but was rejected with ${error.constructor.name}`
      );
    }
  }

  willThrow(errorKlass) {
    try {
      this._actual();

      throw new AssertionError(
        `Expected sync function to throw ${errorKlass.name}, but was successful`
      );
    } catch (error) {
      if (error instanceof errorKlass) {
        return error;
      }

      if (error instanceof AssertionError) {
        throw error;
      }

      throw new AssertionError(
        `Expected sync function to throw ${errorKlass.name} but it thrown ${error.constructor.name}`
      );
    }
  }

  isTrue() {
    if (this._actual === true) {
      return true;
    }

    throw new AssertionError(`Expected value to be true, but is ${this._actual}`);
  }

  isFalse() {
    if (this._actual === false) {
      return true;
    }

    throw new AssertionError(`Expected value to be false, but is ${this._actual}`);
  }

  doesExist() {
    if (!isNil(this._actual)) {
      return true;
    }

    throw new AssertionError('Expected value to exist');
  }

  doesNotExist() {
    if (isNil(this._actual)) {
      return true;
    }

    throw new AssertionError('Expected value to not exist');
  }

  isNull() {
    if (this._actual === null) {
      return true;
    }

    throw new AssertionError('Expected value to be null');
  }

  hasLengthOf(length) {
    if (Object.values(this._actual).length === length) {
      return true;
    }

    throw new AssertionError(
      `Expected ${typeof this._actual} to have a length of '${length}' `
        + `but has a length of '${actualLength}'`
    );
  }

  hasSubstring(substr) {
    if (typeof this._actual !== 'string') {
      throw new AssertionError( `Expected ${this._actual} to be a string`);
    }

    if (this._actual.includes(substr)) {
      return true;
    }

    throw new AssertionError(`Expected ${this._actual} to have a substring '${substr}'`);
  }

  hasKeys(...args) {
    if (difference(args, Object.keys(this._actual)).length === 0) {
      return true;
    }

    throw new AssertionError(
      `Expected ${JSON.stringify(this._actual)} to have a keys ${JSON.stringify(args)}`
    );
  }
}
