export class MoviesFreakError extends Error {
    constructor(args = {}) {
        super(args.message || 'Something unexpected happened');
        this.name = args.name || this.constructor.name;
        this.cause = args.error;
        this.info = args.info || {};
    }
}
export class CouldNotCreateFilm extends MoviesFreakError {
    constructor(error, info = {}) {
        super({
            error,
            info,
            message: 'Could not create a film succesfully'
        });
    }
}
export class CouldNotCreateTVSerie extends MoviesFreakError {
    constructor(error, info = {}) {
        super({
            error,
            info,
            message: 'Could not create a tv serie succesfully'
        });
    }
}
export class CouldNotCreateTVSeasons extends CouldNotCreateTVSerie {
}
export class CouldNotCreateTVEpisodes extends CouldNotCreateTVSeasons {
}
export class CouldNotCreateWatchlist extends MoviesFreakError {
}
export class CouldNotSignUp extends MoviesFreakError {
}
export class CouldNotSignIn extends MoviesFreakError {
}
export class EmailAlreadyUsed extends MoviesFreakError {
}
export class UsernameAlreadyUsed extends MoviesFreakError {
}
export class InvalidType extends MoviesFreakError {
}
export class UserNotFound extends MoviesFreakError {
}
export class InvalidPassword extends MoviesFreakError {
    constructor(password) {
        super({
            message: `Password ${password} invalid`,
            info: { password }
        });
        this.password = password;
    }
}
//# sourceMappingURL=errors.js.map