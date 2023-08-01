import { VError } from 'verror';

export const OK = 200;
export const CREATED = 201;
export const NOT_FOUND = 404;
export const SERVER_ERROR = 500;

export class HTTPError extends VError {
  constructor(...args) {
    super();

    let [code, error] = args;

    if (code !== 'string') {
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

    if (this._isDevelopmentEnv()) {
      payload.error = this.cause;
    }

    return payload;
  }

  get cause() {
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

export class HTTPInternalError extends HTTPError {}
