import { ResultIsNotACollection } from '../../errors';

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

export default class OMDBResult {
  constructor(rawResponse) {
    this._rawResponse = rawResponse;
    this._index = 0;

    this._currentResponse = this._isCollection() ? rawResponse.Search[this._index] : rawResponse;
  }

  get title() {
    return this._currentResponse.Title;
  }

  get rated() {
    return this._currentResponse.Rated;
  }

  get released() {
    return this._currentResponse.Released;
  }

  get runtime() {
    return this._currentResponse.Runtime;
  }

  get genre() {
    return this._currentResponse
      .Genre
      .split(',')
      .map(genre => genre.trim());
  }

  get director() {
    return this._currentResponse.Director;
  }

  get writers() {
    return this._currentResponse
      .Writer
      .split(',')
      .map(writer => writer.trim());
  }

  get actors() {
    return this._currentResponse
      .Actors
      .split(',')
      .map(actor => actor.trim());
  }

  get plot() {
    return this._currentResponse.Plot;
  }

  get language() {
    return this._currentResponse.Language;
  }

  get country() {
    return this._currentResponse.Country;
  }

  get awards() {
    return this._currentResponse.Awards;
  }

  get poster() {
    return this._currentResponse.Poster;
  }

  get ratings() {
    return this._currentResponse.Ratings.map((item) => {
      return new Rating(item.Source, item.Value);
    });
  }

  get imdbId() {
    return this._currentResponse.imdbID;
  }

  get type() {
    return this._type;
  }

  get production() {
    return this._currentResponse.Production;
  }

  get error() {
    if (this._error) {
      return this._error;
    }

    this._error = this._rawResponse.Error;

    return this._error;
  }

  get imdbRating() {
    const ratings = this.ratings.filter((rating) => rating.type === 'imdbRating');
    const rating = ratings[0];

    return rating.value;
  }

  isMovie() {
    return this._type === 'film';
  }

  isSerie() {
    return this._type === 'serie';
  }

  isRequestSuccesful() {
    return JSON.parse(this._rawResponse?.Response?.toLowerCase());
  }

  next() {
    if (!this._isCollection()) {
      throw new ResultIsNotACollection();
    }

    this._setNextIndex();
    this._setCursor();
  }

  _setNextIndex() {
    this._index += 1;
  }

  _setCursor() {
    if (!this._isCollection()) {
      throw new ResultIsNotACollection();
    }

    this._currentResponse = this._rawResponse.Search[this._index];
  }

  _isCollection() {
    return !!this._rawResponse.Search;
  }
}
