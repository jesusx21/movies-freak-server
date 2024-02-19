import { Json } from '../../../../../types/common';
import { ResultIsNotACollection } from '../../../errors';

export class Rating {
  source: string;
  value: string;

  constructor(source: string, value: string) {
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

abstract class DummyResult {
  private collection?: Json[];
  protected currentResponse: Json;
  private index?: number;
  type: string;
  error?: Error;

  constructor(type = 'film') {
    this.type = type;
    this.currentResponse = this.getRawResponse();
  }

  setCollection(collection: Json[]) {
    this.collection = collection;
    this.index = 0;
    this.currentResponse = this.collection[this.index];
  }

  setSingleResult(result: {}) {
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

  get ratings(): Rating[] {
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

  withError(error: Error) {
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

  private setNextIndex() {
    if (!this.index) {
      this.index = 1;
    }

    this.index += 1;
  }

  private setCursor() {
    if (!this.isCollection()) {
      throw new ResultIsNotACollection();
    }

    if (!this.collection) {
      this.collection = []
    }

    if (!this.index) {
      this.index = 0;
    }

    this.currentResponse = this.collection[this.index];
  }

  private isCollection() {
    return !!this.collection;
  }

  abstract getRawResponse(): Json
}

export default DummyResult;
