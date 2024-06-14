export class Episode {
    constructor(rawResponse) {
        this.rawResponse = rawResponse;
    }
    get title() {
        return this.rawResponse.Title;
    }
    get releasedDate() {
        return new Date(this.rawResponse.Released);
    }
    get numberOfEpisode() {
        return Number(this.rawResponse.Episode);
    }
    get imdbId() {
        return this.rawResponse.imdbID;
    }
}
class OMDBTVSeasonResult {
    constructor(rawResponse) {
        this.rawResponse = rawResponse;
        this.episodes = this.loadEpisodes();
    }
    get season() {
        return Number(this.rawResponse.Season);
    }
    get totalSeasons() {
        return Number(this.rawResponse.totalSeasons);
    }
    loadEpisodes() {
        if (!this.rawResponse.Episodes) {
            return [];
        }
        return this.rawResponse.Episodes.map((episode) => new Episode(episode));
    }
    get error() {
        return this.rawResponse.Error;
    }
    isRequestSuccesful() {
        var _a, _b;
        return JSON.parse((_b = (_a = this.rawResponse) === null || _a === void 0 ? void 0 : _a.Response) === null || _b === void 0 ? void 0 : _b.toLowerCase());
    }
}
export default OMDBTVSeasonResult;
//# sourceMappingURL=tvSeason.js.map