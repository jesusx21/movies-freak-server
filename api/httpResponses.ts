export const OK = 200;
export const CREATED = 201;
export const NOT_FOUND = 404;
export const CONFLICT = 409;
export const SERVER_ERROR = 500;

export enum HTTPErrorCodes {
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  conflict = 409,
  preconditionFailed = 412,
  serverError = 500
}

export interface ErrorPayload {
  code: string,
  error?: {}
}

export class HTTPError extends Error {
  private code: string;
  private error?: Error;
  readonly statusCode: HTTPErrorCodes

  constructor(statusCode: HTTPErrorCodes, code: string, error?: Error) {
    super('HTTP error');

    this.code = code;
    this.error = error;
    this.statusCode = SERVER_ERROR;
  }

  get payload() {
    const payload: ErrorPayload = {
      code: this.code
    };

    if (this.isDevelopmentEnv() && this.error) {
      payload.error = this.cause;
    }

    return payload;
  }

  get cause() {
    if (!this.error) {
      return {};
    }

    return {
      ...this.error
    };
  }

  private isDevelopmentEnv() {
    return process.env.NODE_ENV !== 'production';
  }
}

export class HTTPNotFound extends HTTPError {
  constructor(code = 'RESOURCE_NOT_FOUND', cause?: Error) {
    super(NOT_FOUND, code, cause);
  }
}

export class HTTPConflict extends HTTPError {
  constructor(code = 'CONFLICT', cause?: Error) {
    super(CONFLICT, code, cause);
  }
}

export class HTTPInternalError extends HTTPError {
  constructor(error: Error) {
    super(SERVER_ERROR, 'UNEXPECTED_ERROR', error);
  }
}
