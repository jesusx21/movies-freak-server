import { ResultIsNotACollection } from './errors';

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

  get year() {
    if (!this.isMovie()) {
      return null;
    }

    return this._currentResponse.Year;
  }

  get years() {
    if (!this.isSerie()) {
      return {};
    }

    const [from, to] = this._currentResponse.Year.split('–');

    return { from, to };
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
    return this._currentResponse.Genre.split(',');
  }

  get director() {
    return this._currentResponse.Director;
  }

  get writers() {
    return this._currentResponse.Writer.split(',');
  }

  get actors() {
    return this._currentResponse.Actors.split(',');
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
    return this._currentResponse.Type;
  }

  get releasedAt() {
    if (!this.isSerie()) {
      return null;
    }

    const [day, month, year] = this._currentResponse.Released.split(' ');

    const months = {
      Jan: 1,
      Feb: 2,
      Mar: 3,
      Apr: 4,
      May: 5,
      Jun: 6,
      Jul: 7,
      Aug: 8,
      Sep: 9,
      Oct: 10,
      Nov: 11,
      Dec: 12
    };

    return new Date(
      Number(year),
      months[month],
      Number(day)
    );
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

  get totalSeasons() {
    if (!this.isSerie()) {
      return '';
    }

    return this._currentResponse.totalSeasons;
  }

  get imdbRating() {
    const ratings = this.ratings.filter((rating) => rating.type === 'imdbRating');
    const rating = ratings[0];

    return rating.value;
  }

  isMovie() {
    return this._currentResponse.Type === 'movie';
  }

  isSerie() {
    return this._currentResponse.Type === 'series';
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
