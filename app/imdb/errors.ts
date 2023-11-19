interface IMDBErrorParams {
  error?: Error;
  name?: string;
  message?: string;
  info?: {};
}

export class IMDBError extends Error {
  readonly cause?: Error;
  readonly info?: {};

  constructor(args: IMDBErrorParams = {}) {
    super(args.message || 'Something unexpected happened');

    this.name = args.name || this.constructor.name;
    this.cause = args.error;
    this.info = args.info || {};
  }
}

export class DriverNotSupported extends IMDBError {
  readonly driver: string;

  constructor(driver: string) {
    super({
      message: `Driver ${driver} not supported`,
      info: { driver }
    });

    this.driver = driver;
  }
}
export class ResultIsNotACollection extends IMDBError {}
