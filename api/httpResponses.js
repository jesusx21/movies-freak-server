import { VError } from 'verror';

export const CREATED = 201;

export class HTTPError extends VError {
  constructor(...args) {
    super();

    let [code, cause] = args;

    if (code !== 'string') {
      [cause] = args;
      code = 'UNEXPECTED_ERROR';
    }

    this._code = code;
    this._cause = cause;
    this._statusCode = 500;
  }

  get statusCode() {
    return this._statusCode;
  }

  get payload() {
    const payload = {
      code: this._code
    };

    if (this._isDevelopmentEnv()) {
      payload.cause = this._cause;
    }

    return payload;
  }

  _isDevelopmentEnv() {
    return process.env.NODE_ENV !== 'production';
  }
}

export class HTTPInternalError extends HTTPError {}
