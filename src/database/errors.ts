import MoviesFreakError, { ErrorParams } from 'error';

export class DatabaseError extends MoviesFreakError {
  constructor(params: ErrorParams = {}) {
    super(params);
  }
}

export class DatabaseDriverNotSupported extends DatabaseError {
  constructor(driver: string) {
    super({
      info: { driver }
    });
  }
}
