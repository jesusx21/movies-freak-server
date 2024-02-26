import { BoardGameErrorParams, HTTPMethods, Json } from './types';

export class BoardGameError extends Error {
  readonly cause?: Error;
  readonly info?: Json;

  constructor(args: BoardGameErrorParams = {}) {
    super(args.message ?? 'Something unexpected happened');

    this.name = args.name ?? this.constructor.name;
    this.cause = args.error;
    this.info = args.info ?? {};
  }
}

export class MonopolyError extends BoardGameError {
  constructor(args: BoardGameErrorParams = {}) {
    super(args);
  }
}

export class MethodNotImplemented extends MonopolyError {
  constructor(method: HTTPMethods) {
    super({ message: `Method ${method} not implemented for resource` });
  }
}

export class DependencyNotFound extends MonopolyError {
  dependencyName: string;

  constructor(dependencyName: string) {
    super({
      message: `Monopoly dependency "${dependencyName}" was not found`,
      info: { dependencyName }
    });

    this.dependencyName = dependencyName;
  }
}
