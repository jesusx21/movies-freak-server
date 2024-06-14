export class IMDBError extends Error {
    constructor(args = {}) {
        super(args.message || 'Something unexpected happened');
        this.name = args.name || this.constructor.name;
        this.cause = args.error;
        this.info = args.info || {};
    }
}
export class DriverNotSupported extends IMDBError {
    constructor(driver) {
        super({
            message: `Driver ${driver} not supported`,
            info: { driver }
        });
        this.driver = driver;
    }
}
export class IncorrectIMDBId extends IMDBError {
    constructor() {
        super({
            message: 'Incorrect IMDB Id'
        });
    }
}
export class InvalidAPIKey extends IMDBError {
    constructor() {
        super({
            message: 'Invalid API key'
        });
    }
}
export class MissingIMDBCredentials extends IMDBError {
}
export class ResultIsNotACollection extends IMDBError {
}
//# sourceMappingURL=errors.js.map