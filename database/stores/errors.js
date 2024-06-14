export class DatabaseError extends Error {
    constructor(args = {}) {
        super(args.message || 'Something unexpected happened');
        this.name = args.name || this.constructor.name;
        this.cause = args.error;
        this.info = args.info || {};
    }
}
export class NotFound extends DatabaseError {
    constructor(query) {
        super({
            message: 'Record not found on database',
            info: { query }
        });
        this.query = query;
    }
}
export class FilmNotFound extends NotFound {
}
export class SessionNotFound extends NotFound {
}
export class TVEpisodeNotFound extends NotFound {
}
export class TVSerieNotFound extends NotFound {
}
export class TVSeasonNotFound extends NotFound {
}
export class UserNotFound extends NotFound {
}
export class EmailAlreadyExists extends DatabaseError {
}
export class UsernameAlreadyExists extends DatabaseError {
}
export class IMDBIdAlreadyExists extends DatabaseError {
    constructor(imdbId) {
        const info = imdbId ? { imdbId } : {};
        super({ info });
    }
}
//# sourceMappingURL=errors.js.map