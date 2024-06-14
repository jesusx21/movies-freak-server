import { HTTPStatusCode } from '../boardGame/types';
export var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes["BAD_REQUEST"] = "BAD_REQUEST";
    ErrorCodes["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCodes["FORBIDDEN"] = "FORBIDDEN";
    ErrorCodes["NOT_FOUND"] = "NOT_FOUND";
    ErrorCodes["CONFLICT"] = "CONFLICT";
    ErrorCodes["PRECONDITION_FAILED"] = "PRECONDITION_FAILED";
    ErrorCodes["UNEXPECTED_ERROR"] = "UNEXPECTED_ERROR";
})(ErrorCodes || (ErrorCodes = {}));
export class HTTPError extends Error {
    constructor(statusCode, code, error) {
        super('HTTP error');
        this.code = code;
        this.statusCode = statusCode;
        if (error) {
            this.error = {
                name: error.name,
                message: error.message
            };
        }
    }
    get payload() {
        const payload = {
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
        return Object.assign({}, this.error);
    }
    isDevelopmentEnv() {
        return process.env.NODE_ENV !== 'production';
    }
}
export class HTTPNotFound extends HTTPError {
    constructor(code = ErrorCodes.NOT_FOUND, cause) {
        super(HTTPStatusCode.NOT_FOUND, code, cause);
    }
}
export class HTTPConflict extends HTTPError {
    constructor(code = ErrorCodes.CONFLICT, cause) {
        super(HTTPStatusCode.CONFLICT, code, cause);
    }
}
export class HTTPInternalError extends HTTPError {
    constructor(error) {
        super(HTTPStatusCode.UNEXPECTED_ERROR, ErrorCodes.UNEXPECTED_ERROR, error);
    }
}
//# sourceMappingURL=httpResponses.js.map