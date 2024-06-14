import DummyResult, { Rating } from './dummy';
class DummyTVEpisodeResult extends DummyResult {
    constructor() {
        super();
        this.type = 'episode';
    }
    get year() {
        return this.currentResponse.year;
    }
    get numberOfSeason() {
        return this.currentResponse.numberOfSeason;
    }
    get numberOfEpisode() {
        return this.currentResponse.numberOfEpisode;
    }
    get language() {
        return this.currentResponse.language;
    }
    get serieIMDBId() {
        return this.currentResponse.serieIMDBId;
    }
    getRawResponse() {
        return {
            title: 'How Your Mother Met Me',
            year: '2014',
            rated: 'TV-14',
            released: '27 Jan 2014',
            numberOfSeason: 9,
            numberOfEpisode: 16,
            runtime: '23 min',
            genre: ['Comedy', 'Drama', 'Romance'],
            director: 'Pamela Fryman',
            writers: ['Carter Bays', 'Craig Thomas'],
            actors: ['Josh Radnor', 'Jason Segel', 'Cobie Smulders'],
            plot: 'The story of The Mother, from her traumatic 21st birthday to a number of close '
                + 'calls with meeting Ted to the night before Barney and Robin\'s wedding.',
            language: ['English', 'French'],
            country: 'United States',
            awards: 'N/A',
            poster: 'https://m.media-amazon.com/images/M/MV5BMTc4ODM2MDQwNF5BMl5BanBnXkFt'
                + 'ZTgwMzE0MzMwMTE@._V1_SX300.jpg',
            ratings: [
                new Rating('Internet Movie Database', '9.5/10')
            ],
            imdbId: 'tt3390684',
            serieIMDBId: 'tt0460649'
        };
    }
}
export default DummyTVEpisodeResult;
//# sourceMappingURL=tvEpisode.js.map