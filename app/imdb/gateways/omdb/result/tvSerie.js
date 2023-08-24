import OMDBResult from './omdb';

export default class OMDBTVSerieResult extends OMDBResult {
  constructor(rawResponse) {
    super(rawResponse);

    this._type = 'serie';
  }

  get years() {
    const [from, to] = this._currentResponse.Year.split('–');

    return { from, to };
  }

  get releasedAt() {
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

  get totalSeasons() {
    return Number(this._currentResponse.totalSeasons);
  }

  isMovie() {
    return false;
  }

  isSerie() {
    return true;
  }
}
