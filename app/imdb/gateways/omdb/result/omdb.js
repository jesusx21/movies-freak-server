import { ResultIsNotACollection } from '../../../errors';
class Rating {
    constructor(source, value) {
        this.source = source;
        this.value = value;
    }
    get type() {
        if (this.source === 'Internet Movie Database') {
            return 'imdbRating';
        }
        if (this.source === 'Rotten Tomatoes') {
            return 'rottenTomatoes';
        }
        if (this.source === 'Metacritic') {
            return 'metacritic';
        }
        return 'unknown';
    }
}
class OMDBResult {
    constructor(rawResponse) {
        this.rawResponse = rawResponse;
        this.index = 0;
        this.currentResponse = this.isCollection() ? rawResponse.Search[this.index] : rawResponse;
    }
    get title() {
        return this.currentResponse.Title;
    }
    get rated() {
        return this.currentResponse.Rated;
    }
    get released() {
        return this.currentResponse.Released;
    }
    get runtime() {
        return this.currentResponse.Runtime;
    }
    get genre() {
        return this.currentResponse
            .Genre
            .split(',')
            .map((genre) => genre.trim());
    }
    get director() {
        return this.currentResponse.Director;
    }
    get writers() {
        return this.currentResponse
            .Writer
            .split(',')
            .map((writer) => writer.trim());
    }
    get actors() {
        return this.currentResponse
            .Actors
            .split(',')
            .map((actor) => actor.trim());
    }
    get plot() {
        return this.currentResponse.Plot;
    }
    get language() {
        return this.currentResponse.Language;
    }
    get country() {
        return this.currentResponse.Country;
    }
    get awards() {
        return this.currentResponse.Awards;
    }
    get poster() {
        return this.currentResponse.Poster;
    }
    get ratings() {
        return this.currentResponse.Ratings.map((item) => {
            return new Rating(item.Source, item.Value);
        });
    }
    get imdbId() {
        return this.currentResponse.imdbID;
    }
    get production() {
        return this.currentResponse.Production;
    }
    get error() {
        return this.rawResponse.Error;
    }
    get imdbRating() {
        const ratings = this.ratings.filter((rating) => rating.type === 'imdbRating');
        const rating = ratings[0];
        return rating.value;
    }
    isMovie() {
        return this.type === 'film';
    }
    isSerie() {
        return this.type === 'serie';
    }
    isEpisode() {
        return this.type === 'episode';
    }
    isRequestSuccesful() {
        var _a, _b;
        return JSON.parse((_b = (_a = this.rawResponse) === null || _a === void 0 ? void 0 : _a.Response) === null || _b === void 0 ? void 0 : _b.toLowerCase());
    }
    next() {
        if (!this.isCollection()) {
            throw new ResultIsNotACollection();
        }
        this.setNextIndex();
        this.setCursor();
    }
    setNextIndex() {
        this.index += 1;
    }
    setCursor() {
        if (!this.isCollection()) {
            throw new ResultIsNotACollection();
        }
        this.currentResponse = this.rawResponse.Search[this.index];
    }
    isCollection() {
        return !!this.rawResponse.Search;
    }
}
export default OMDBResult;
//# sourceMappingURL=omdb.js.map