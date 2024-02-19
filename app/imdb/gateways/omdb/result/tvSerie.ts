import OMDBResult from './omdb';
import { IMDBMonth } from '../../../../../types/app';

class OMDBTVSerieResult extends OMDBResult {
  constructor(rawResponse: any) {
    super(rawResponse);

    this.type = 'serie';
  }

  get years() {
    const [from, to] = this.currentResponse.Year.split('–');

    return { from, to };
  }

  get releasedAt() {
    const months = {
      [IMDBMonth.JAN]: 1,
      [IMDBMonth.FEB]: 2,
      [IMDBMonth.MAR]: 3,
      [IMDBMonth.APR]: 4,
      [IMDBMonth.MAY]: 5,
      [IMDBMonth.JUN]: 6,
      [IMDBMonth.JUL]: 7,
      [IMDBMonth.AUG]: 8,
      [IMDBMonth.SEP]: 9,
      [IMDBMonth.OCT]: 10,
      [IMDBMonth.NOV]: 11,
      [IMDBMonth.DEC]: 12
    };

    const [day, month, year] : [string, IMDBMonth, string] = this.currentResponse
      .Released
      .split(' ');

    return new Date(
      Number(year),
      months[month],
      Number(day)
    );
  }

  get totalSeasons() {
    return Number(this.currentResponse.totalSeasons);
  }

  isMovie() {
    return false;
  }

  isSerie() {
    return true;
  }
}

export default OMDBTVSerieResult;
