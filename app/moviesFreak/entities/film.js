import Entity from './entity';
class Film extends Entity {
    constructor(args) {
        super(args.id, args.createdAt, args.updatedAt);
        this.name = args.name;
        this.plot = args.plot;
        this.title = args.title;
        this.year = args.year;
        this.rated = args.rated;
        this.runtime = args.runtime;
        this.director = args.director;
        this.poster = args.poster;
        this.production = args.production;
        this.genre = args.genre;
        this.writers = args.writers;
        this.actors = args.actors;
        this.imdbId = args.imdbId;
        this.imdbRating = args.imdbRating;
    }
}
export default Film;
//# sourceMappingURL=film.js.map