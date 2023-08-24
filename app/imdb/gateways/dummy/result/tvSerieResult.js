import DummyResult, { Rating } from './dummyResult';

export default class DummyTVSerieResult extends DummyResult {
  constructor() {
    super();

    this._type = 'serie';
  }

  get years() {
    return this._currentResponse.years;
  }

  get releasedAt() {
    return this._currentResponse.releasedAt;
  }

  get totalSeasons() {
    return this._currentResponse.totalSeasons;
  }

  get _rawResponse() {
    return {
      title: 'How I Met Your Mother',
      years: { from: '2005', to: '2014' },
      releasedAt: new Date(2005, 9, 19),
      totalSeasons: 9,
      rated: 'TV-14',
      released: '19 Sep 2005',
      runtime: '22 min',
      genre: ['Comedy', 'Drama', 'Romance'],
      director: 'N/A',
      writers: ['Carter Bays', 'Craig Thomas'],
      actors: ['Josh Radnor', 'Jason Segel', 'Cobie Smulders'],
      plot: 'A father recounts to his children - through a series of flashbacks - '
        + 'the journey he and his four best friends took leading up to him meeting their mother.',
      language: 'English, Persian, Chinese',
      country: 'United States',
      awards: 'Won 10 Primetime Emmys. 26 wins & 95 nominations total',
      poster: 'https://m.media-amazon.com/images/M/MV5BNjg1MDQ5MjQ2N15BMl5'
        + 'BanBnXkFtZTYwNjI5NjA3._V1_SX300.jpg',
      ratings: [
        new Rating('Internet Movie Database', '8.3/10')
      ],
      imdbId: 'tt0460649',
      production: 'N/A'
    };
  }
}
