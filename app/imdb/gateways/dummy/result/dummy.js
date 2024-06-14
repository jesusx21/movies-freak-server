import { ResultIsNotACollection } from '../../../errors';
export class Rating {
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
class DummyResult {
    constructor(type = 'film') {
        this.type = type;
        this.currentResponse = this.getRawResponse();
    }
    setCollection(collection) {
        this.collection = collection;
        this.index = 0;
        this.currentResponse = this.collection[this.index];
    }
    setSingleResult(result) {
        this.collection = undefined;
        this.index = 0;
        this.currentResponse = result;
    }
    get title() {
        return this.currentResponse.title;
    }
    get rated() {
        return this.currentResponse.rated;
    }
    get released() {
        return this.currentResponse.released;
    }
    get runtime() {
        return this.currentResponse.runtime;
    }
    get genre() {
        return this.currentResponse.genre;
    }
    get director() {
        return this.currentResponse.director;
    }
    get writers() {
        return this.currentResponse.writers;
    }
    get actors() {
        return this.currentResponse.actors;
    }
    get plot() {
        return this.currentResponse.plot;
    }
    get language() {
        return this.currentResponse.language;
    }
    get country() {
        return this.currentResponse.country;
    }
    get awards() {
        return this.currentResponse.awards;
    }
    get poster() {
        return this.currentResponse.poster;
    }
    get ratings() {
        return this.currentResponse.ratings;
    }
    get imdbId() {
        return this.currentResponse.imdbId;
    }
    get production() {
        return this.currentResponse.production;
    }
    get imdbRating() {
        const ratings = this.ratings.filter((rating) => rating.type === 'imdbRating');
        const rating = ratings[0];
        return rating.value;
    }
    withError(error) {
        this.error = error;
    }
    isRequestSuccesful() {
        return !this.error;
    }
    next() {
        if (!this.isCollection()) {
            throw new ResultIsNotACollection();
        }
        this.setNextIndex();
        this.setCursor();
    }
    isMovie() {
        return this.currentResponse.type === 'film';
    }
    isSerie() {
        return this.currentResponse.type === 'serie';
    }
    setNextIndex() {
        if (!this.index) {
            this.index = 1;
        }
        this.index += 1;
    }
    setCursor() {
        if (!this.isCollection()) {
            throw new ResultIsNotACollection();
        }
        if (!this.collection) {
            this.collection = [];
        }
        if (!this.index) {
            this.index = 0;
        }
        this.currentResponse = this.collection[this.index];
    }
    isCollection() {
        return !!this.collection;
    }
}
export default DummyResult;
//# sourceMappingURL=dummy.js.map