import { VError } from 'verror';

export const CREATED = 201;

export class HTTPError extends VError {
  constructor(...args) {
    super();

    let [_code, _cause] = args;

    if (_code !== 'string') {
      _cause = args[0]
      _code = 'UNEXPECTED_ERROR';
    }

    Object.assign(this, { _code, _cause });
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
    return process_params.env.NODE_ENV !== 'production';
  }
}

export class HTTPInternalError extends HTTPError {}