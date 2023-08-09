export class MonopolyError extends Error {
  get name() {
    return this.constructor.name;
  }
}

export class TokenNotUsed extends MonopolyError {
  constructor() {
    super(...arguments);

    this.message = 'Monopoly token not used';
  }
}

export class TitleNotFound extends MonopolyError {
  constructor(titleName) {
    super(...arguments);

    this.message = `Monopoly title "${titleName}" was not found`;
  }
}
