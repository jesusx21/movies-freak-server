import OMDBResult from './omdb';

class OMDBFilmResult extends OMDBResult {
  constructor(rawResponse: any) {
    super(rawResponse);

    this.type = 'film';
  }

  get year() {
    return this.currentResponse.Year;
  }
}

export default OMDBFilmResult
