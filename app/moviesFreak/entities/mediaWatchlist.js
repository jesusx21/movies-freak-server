import Entity from './entity';
import { FilmAlreadySet, TVEpisodeAlreadySet } from './errors';
class MediaWatchlist extends Entity {
    constructor(args) {
        super(args.id, args.createdAt, args.updatedAt);
        this.watchlistId = args.watchlistId;
        this._filmId = args.filmId;
        this._tvEpisodeId = args.tvEpisodeId;
        this.index = args.index;
        this.watched = args.watched;
    }
    get filmId() {
        return this._filmId;
    }
    get tvEpisodeId() {
        return this._tvEpisodeId;
    }
    get mediaType() {
        if (this._filmId) {
            return 'film';
        }
        if (this.tvEpisode) {
            return 'tvEpisode';
        }
        return 'N/A';
    }
    setFilm(film) {
        if (this.film) {
            throw new FilmAlreadySet();
        }
        if (this.tvEpisode) {
            throw new TVEpisodeAlreadySet();
        }
        this.film = film;
        this._filmId = film.id;
    }
    setTVEpisode(tvEpisode) {
        if (this.film) {
            throw new FilmAlreadySet();
        }
        if (this.tvEpisode) {
            throw new TVEpisodeAlreadySet();
        }
        this.tvEpisode = tvEpisode;
        this._tvEpisodeId = tvEpisode.id;
    }
}
export default MediaWatchlist;
//# sourceMappingURL=mediaWatchlist.js.map