import DummyResult, { Rating } from './dummyResult';

export default class DummyFilmResult extends DummyResult {
  constructor() {
    super();

    this._type = 'film';
  }

  get year() {
    return this._currentResponse.year;
  }

  get _rawResponse() {
    return {
      title: 'The Shawshank Redemption',
      year: '1994',
      rated: 'R',
      released: '14 Oct 1994',
      runtime: '142 min',
      genre: ['Drama'],
      director: 'Frank Darabont',
      writers: ['Stephen King', 'Frank Darabont'],
      actors: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
      plot: 'Over the course of several years, two convicts form a friendship, '
        + 'seeking consolation and, eventually, redemption through basic compassion.',
      language: 'English',
      country: 'United States',
      awards: 'Nominated for 7 Oscars. 21 wins & 42 nominations total',
      poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJ'
        + 'iNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
      ratings: [
        new Rating('Internet Movie Database', '9.3/10'),
        new Rating('Rotten Tomatoes', '91%'),
        new Rating('Metacritic', '82/100')
      ],
      imdbId: 'tt0111161',
      production: 'N/A'
    };
  }
}
