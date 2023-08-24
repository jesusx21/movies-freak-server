import OMDBResult from './omdb';

export default class OMDBTVEpisodeResult extends OMDBResult {
  constructor(rawResponse) {
    super(rawResponse);

    this._type = 'episode';
  }

  get year() {
    return this._currentResponse.Year;
  }

  get numberOfSeason() {
    return Number(this._currentResponse.Season);
  }

  get numberOfEpisode() {
    return Number(this._currentResponse.Episode);
  }

  get language() {
    return this._currentResponse
      .Language
      .split(',')
      .map(language => language.trim());
  }

  get serieIMDBId() {
    return this._currentResponse.seriesID;
  }

  get type() {
    return this._type;
  }
}
