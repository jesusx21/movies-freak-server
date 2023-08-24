import OMDBResult from './omdbResult';

export default class OMDBFilmResult extends OMDBResult {
  constructor(rawResponse) {
    super(rawResponse);

    this._type = 'film';
  }

  get year() {
    return this._currentResponse.Year;
  }
}
