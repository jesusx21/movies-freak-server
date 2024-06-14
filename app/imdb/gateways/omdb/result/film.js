import OMDBResult from './omdb';
class OMDBFilmResult extends OMDBResult {
    constructor(rawResponse) {
        super(rawResponse);
        this.type = 'film';
    }
    get year() {
        return this.currentResponse.Year;
    }
}
export default OMDBFilmResult;
//# sourceMappingURL=film.js.map