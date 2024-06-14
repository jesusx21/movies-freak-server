import Entity from './entity';
class Watchlist extends Entity {
    constructor(args) {
        super(args.id, args.createdAt, args.updatedAt);
        this.name = args.name;
        this.type = args.type;
        this.description = args.description;
        this.totalFilms = args.totalFilms;
        this.totalTVEpisodes = args.totalTVEpisodes;
    }
}
export default Watchlist;
//# sourceMappingURL=watchlist.js.map