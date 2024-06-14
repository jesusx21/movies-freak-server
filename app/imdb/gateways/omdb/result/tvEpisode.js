import OMDBResult from './omdb';
class OMDBTVEpisodeResult extends OMDBResult {
    constructor(rawResponse) {
        super(rawResponse);
        this.type = 'episode';
    }
    get year() {
        return this.currentResponse.Year;
    }
    get numberOfSeason() {
        return Number(this.currentResponse.Season);
    }
    get numberOfEpisode() {
        return Number(this.currentResponse.Episode);
    }
    get language() {
        return this.currentResponse
            .Language
            .split(',')
            .map((language) => language.trim());
    }
    get serieIMDBId() {
        return this.currentResponse.seriesID;
    }
}
export default OMDBTVEpisodeResult;
//# sourceMappingURL=tvEpisode.js.map