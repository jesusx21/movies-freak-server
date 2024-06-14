import Entity from './entity';
class TVSerie extends Entity {
    constructor(args) {
        super(args.id, args.createdAt, args.updatedAt);
        this.imdbId = args.imdbId;
        this.name = args.name;
        this.plot = args.plot;
        this.years = args.years;
        this.rated = args.rated;
        this.genre = args.genre;
        this.writers = args.writers;
        this.actors = args.actors;
        this.poster = args.poster;
        this.imdbRating = args.imdbRating;
        this.totalSeasons = args.totalSeasons;
        this.releasedAt = args.releasedAt;
        this.tvSeasons = [];
    }
    addTvSeason(tvSeason) {
        this.tvSeasons.push(tvSeason);
    }
}
export default TVSerie;
//# sourceMappingURL=tvSerie.js.map