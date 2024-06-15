import { HTTPStatusCode } from '../boardGame/types';
import { APIError } from '../types/api';
import { Json } from '../types/common';

export enum ErrorCodes {
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  PRECONDITION_FAILED = 'PRECONDITION_FAILED',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR'
}

export class HTTPError extends Error {
  private code: string;
  private error?: Json;
  readonly statusCode: HTTPStatusCode

  constructor(statusCode: HTTPStatusCode, code: string, error?: Json) {
    super('HTTP error');

    this.code = code;
    this.statusCode = statusCode;

    if (error) {
      this.error = {
        name: error.name,
        message: error.message
      }
    }
  }

  get payload() {
    const payload: APIError = {
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
  constructor(code: string = ErrorCodes.NOT_FOUND, cause?: Json) {
    super(HTTPStatusCode.NOT_FOUND, code, cause);
  }
}

export class HTTPConflict extends HTTPError {
  constructor(code: string = ErrorCodes.CONFLICT, cause?: Json) {
    super(HTTPStatusCode.CONFLICT, code, cause);
  }
}

export class HTTPInternalError extends HTTPError {
  constructor(error: Json) {
    super(HTTPStatusCode.UNEXPECTED_ERROR, ErrorCodes.UNEXPECTED_ERROR, error);
  }
}
