import { ResultIsNotACollection } from './errors';

export class Rating {
  constructor(source, value) {
    this.source = source;
    this.value = value;
  }
}

export default class DummyResult {
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
    return this._currentResponse.year;
  }

  get rated() {
    return this._currentResponse.rated;
  }

  get released() {
    return this._currentResponse.released;
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

  get error() {
    return this._error;
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
    this._setCursor()
  }

  _setNextIndex() {
    this._index += 1;
  }

  _setCursor() {
    if (!this._isCollection()) {
      throw new ResultIsNotACollection();
    }

    this._currentResponse = this._collection[this._index]
  }

  _isCollection() {
    return !!this._collection
  }
}