import OMDBResult from './omdb';

export default class OMDBFilmResult extends OMDBResult {
  constructor(rawResponse) {
    super(rawResponse);

    this._type = 'film';
  }

  get year() {
    return this._currentResponse.Year;
  }
}
