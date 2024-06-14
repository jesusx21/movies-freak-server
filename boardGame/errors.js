export class BoardGameError extends Error {
    constructor(args = {}) {
        super(args.message || 'Something unexpected happened');
        this.name = args.name || this.constructor.name;
        this.cause = args.error;
        this.info = args.info || {};
    }
}
export class MonopolyError extends BoardGameError {
    constructor(args = {}) {
        super(args);
    }
}
export class TokenNotUsed extends MonopolyError {
    constructor() {
        super({ message: 'Monopoly token not used' });
    }
}
export class TitleNotFound extends MonopolyError {
    constructor(titleName) {
        super({
            message: `Monopoly title "${titleName}" was not found`,
            info: { titleName }
        });
        this.titleName = titleName;
    }
}
//# sourceMappingURL=errors.js.map