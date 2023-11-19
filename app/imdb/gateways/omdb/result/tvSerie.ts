import OMDBResult from './omdb';

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
    const [day, month, year] = this.currentResponse.Released.split(' ');

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
