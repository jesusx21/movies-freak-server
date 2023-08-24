import { isEmpty } from 'lodash';

class Episode {
  constructor(rawResponse) {
    this._rawResponse = rawResponse;
  }

  get title() {
    return this._rawResponse.Title;
  }

  get releasedDate() {
    return new Date(this._rawResponse.Released);
  }

  get numberOfEpisode() {
    return Number(this._rawResponse.Episode);
  }

  get imdbId() {
    return this._rawResponse.imdbID;
  }
}

export default class OMDBTVSeasonResult {
  constructor(rawResponse) {
    this._rawResponse = rawResponse;
    this._episodes = [];
  }

  get season() {
    return Number(this._rawResponse.Season);
  }

  get totalSeasons() {
    return Number(this._rawResponse.totalSeasons);
  }

  get episodes() {
    if (!isEmpty(this._episodes)) {
      return this._episodes;
    }

    this._episodes = this._rawResponse.Episodes.map((episode) => new Episode(episode));

    return this._episodes;
  }

  get error() {
    if (this._error) {
      return this._error;
    }

    this._error = this._rawResponse.Error;

    return this._error;
  }

  isRequestSuccesful() {
    return JSON.parse(this._rawResponse?.Response?.toLowerCase());
  }
}
