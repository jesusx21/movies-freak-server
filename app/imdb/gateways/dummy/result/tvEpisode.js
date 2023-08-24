import DummyResult, { Rating } from './dummy';

export default class DummyTVEpisodeResult extends DummyResult {
  constructor() {
    super();

    this._type = 'episode';
  }

  get year() {
    return this._currentResponse.year;
  }

  get numberOfSeason() {
    return this._currentResponse.numberOfSeason;
  }

  get numberOfEpisode() {
    return this._currentResponse.numberOfEpisode;
  }

  get language() {
    return this._currentResponse.language;
  }

  get serieIMDBId() {
    return this._currentResponse.serieIMDBId;
  }

  get _rawResponse() {
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
