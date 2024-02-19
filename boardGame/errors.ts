import { BoardGameErrorParams } from './types';

export class BoardGameError extends Error {
  readonly cause?: Error;
  readonly info?: {};

  constructor(args: BoardGameErrorParams = {}) {
    super(args.message || 'Something unexpected happened');

    this.name = args.name || this.constructor.name;
    this.cause = args.error;
    this.info = args.info || {};
  }
}

export class MonopolyError extends BoardGameError {
  constructor(args: BoardGameErrorParams = {}) {
    super(args);
  }
}

export class TokenNotUsed extends MonopolyError {
  constructor() {
    super({ message: 'Monopoly token not used' });
  }
}

export class TitleNotFound extends MonopolyError {
  titleName: string;

  constructor(titleName: string) {
    super({
      message: `Monopoly title "${titleName}" was not found`,
      info: { titleName }
    });

    this.titleName = titleName;
  }
}
