import Entity from './entity';
class TVEpisode extends Entity {
    constructor(args) {
        super(args.id, args.createdAt, args.updatedAt);
        this.imdbId = args.imdbId;
        this.name = args.name;
        this.year = args.year;
        this.seasonNumber = args.seasonNumber;
        this.episodeNumber = args.episodeNumber;
        this.genre = args.genre;
        this.director = args.director;
        this.writers = args.writers;
        this.actors = args.actors;
        this.plot = args.plot;
        this.languages = args.languages;
        this.country = args.country;
        this.poster = args.poster;
        this.awards = args.awards;
        this.imdbRating = args.imdbRating;
        this.releasedAt = args.releasedAt;
        this.tvSerieId = args.tvSerieId;
        this.tvSeasonId = args.tvSeasonId;
    }
}
export default TVEpisode;
//# sourceMappingURL=tvEpisode.js.map