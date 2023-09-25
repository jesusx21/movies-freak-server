import { VError } from 'verror';

export const OK = 200;
export const CREATED = 201;
export const NOT_FOUND = 404;
export const CONFLICT = 409;
export const SERVER_ERROR = 500;

export class HTTPError extends VError {
  constructor(...args) {
    super();

    let [code, error] = args;

    if (typeof code !== 'string') {
      [error] = args;
      code = 'UNEXPECTED_ERROR';
    }

    this._code = code;
    this._error = error;
    this._statusCode = SERVER_ERROR;
  }

  get statusCode() {
    return this._statusCode;
  }

  get payload() {
    const payload = {
      code: this._code
    };

    if (this._isDevelopmentEnv() && this._error) {
      payload.error = this.cause;
    }

    return payload;
  }

  get cause() {
    if (!this._error) {
      return {};
    }

    return {
      name: this._error.constructor.name,
      ...this._error
    };
  }

  _isDevelopmentEnv() {
    return process.env.NODE_ENV !== 'production';
  }
}

export class HTTPNotFound extends HTTPError {
  constructor(code = 'RESOURCE_NOT_FOUND', cause = null) {
    super(code, cause);

    this._statusCode = NOT_FOUND;
  }
}

export class HTTPConflict extends HTTPError {
  constructor(code = 'CONFLICT', cause = null) {
    super(code, cause);

    this._statusCode = CONFLICT;
  }
}

export class HTTPInternalError extends HTTPError {}
