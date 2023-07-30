import { ResultIsNotACollection } from './errors';

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

export default class DummyResult {
  constructor(type = 'film') {
    this._currentResponse = this._rawResponse;
    this._currentResponse.type = type;
  }

  setCollection(collection) {
    this._collection = collection;
    this._index = 0;
    this._currentResponse = this._collection[this._index];
  }

  setSingleResult(result) {
    delete this._collection;
    this._index = 0;
    this._currentResponse = result;
  }

  get title() {
    return this._currentResponse.title;
  }

  get year() {
    if (!this.isMovie()) {
      return null;
    }

    return this._currentResponse.year;
  }

  get years() {
    if (!this.isSerie()) {
      return {};
    }

    return this._currentResponse.years;
  }

  get rated() {
    return this._currentResponse.rated;
  }

  get released() {
    return this._currentResponse.released;
  }

  get releasedAt() {
    return this._currentResponse.releasedAt;
  }

  get runtime() {
    return this._currentResponse.runtime;
  }

  get genre() {
    return this._currentResponse.genre;
  }

  get director() {
    return this._currentResponse.director;
  }

  get writers() {
    return this._currentResponse.writers;
  }

  get actors() {
    return this._currentResponse.actors;
  }

  get plot() {
    return this._currentResponse.plot;
  }

  get language() {
    return this._currentResponse.language;
  }

  get country() {
    return this._currentResponse.country;
  }

  get awards() {
    return this._currentResponse.awards;
  }

  get poster() {
    return this._currentResponse.poster;
  }

  get ratings() {
    return this._currentResponse.ratings;
  }

  get imdbId() {
    return this._currentResponse.imdbId;
  }

  get type() {
    return this._currentResponse.type;
  }

  get production() {
    return this._currentResponse.production;
  }

  get totalSeasons() {
    if (!this.isSerie()) {
      return '';
    }

    return this._currentResponse.totalSeasons;
  }

  get error() {
    return this._error;
  }

  get imdbRating() {
    const ratings = this.ratings.filter((rating) => rating.type === 'imdbRating');
    const rating = ratings[0];

    return rating.value;
  }

  withError(error) {
    this._error = error;
  }

  isRequestSuccesful() {
    return !this._error;
  }

  next() {
    if (!this._isCollection()) {
      throw new ResultIsNotACollection();
    }

    this._setNextIndex();
    this._setCursor();
  }

  isMovie() {
    return this._currentResponse.type === 'film';
  }

  isSerie() {
    return this._currentResponse.type === 'tvSerie';
  }

  _setNextIndex() {
    this._index += 1;
  }

  _setCursor() {
    if (!this._isCollection()) {
      throw new ResultIsNotACollection();
    }

    this._currentResponse = this._collection[this._index];
  }

  _isCollection() {
    return !!this._collection;
  }

  get _rawResponse() {
    return {
      title: 'The Shawshank Redemption',
      year: '1994',
      years: { from: '1994', to: '1995' },
      rated: 'R',
      released: '14 Oct 1994',
      releasedAt: new Date(2015, 6, 23),
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
      totalSeasons: 10,
      production: 'N/A'
    };
  }
}
