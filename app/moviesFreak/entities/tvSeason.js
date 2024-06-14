import Entity from './entity';
class TVSeason extends Entity {
    constructor(args) {
        super(args.id, args.createdAt, args.updatedAt);
        this.tvSerieId = args.tvSerieId;
        this.seasonNumber = args.seasonNumber;
        this.plot = args.plot;
        this.poster = args.poster;
        this.releasedAt = args.releasedAt;
    }
}
export default TVSeason;
//# sourceMappingURL=tvSeason.js.map