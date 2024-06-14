export var HTTPStatusCode;
(function (HTTPStatusCode) {
    HTTPStatusCode[HTTPStatusCode["OK"] = 200] = "OK";
    HTTPStatusCode[HTTPStatusCode["CREATED"] = 201] = "CREATED";
    HTTPStatusCode[HTTPStatusCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    HTTPStatusCode[HTTPStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTPStatusCode[HTTPStatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HTTPStatusCode[HTTPStatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HTTPStatusCode[HTTPStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HTTPStatusCode[HTTPStatusCode["CONFLICT"] = 409] = "CONFLICT";
    HTTPStatusCode[HTTPStatusCode["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    HTTPStatusCode[HTTPStatusCode["UNEXPECTED_ERROR"] = 500] = "UNEXPECTED_ERROR";
})(HTTPStatusCode || (HTTPStatusCode = {}));
;
;
;
//# sourceMappingURL=types.js.map