import axios from 'axios';

import OMDBResult from './omdbResult';
import { IMDBError } from '../../errors';
import OMDBTVSeasonResult from './tvSesonResult';
import OMDBFilmResult from './filmResult';
import OMDBTVSerieResult from './tvSerieResult';

export default class OMDBGateway {
  constructor(host, apiKey) {
    this._host = host;
    this._apiKey = apiKey;
  }

  fetchFilmById(imdbId) {
    const query = {
      type: 'movie',
      i: imdbId
    };

    return this._request(query, 'film');
  }

  fetchTVSerieById(imdbId) {
    const query = {
      type: 'series',
      i: imdbId
    };

    return this._request(query, 'serie');
  }

  fetchTVSeasonBySerieId(serieImdbId, seasonNumber) {
    const query = {
      i: serieImdbId,
      type: 'series',
      Season: seasonNumber
    };

    return this._request(query, 'season');
  }

  async _request(query, type) {
    const params = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join('&');

    let response;

    try {
      response = await axios
        .get(`${this._host}?apikey=${this._apiKey}&${params}`);
    } catch (error) {
      response = error.response;
    }

    let omdbResult;

    switch (type) {
      case 'film':
        omdbResult = new OMDBFilmResult(response.data);
        break;
      case 'serie':
        omdbResult = new OMDBTVSerieResult(response.data);
        break;
      case 'season':
        omdbResult = new OMDBTVSeasonResult(response.data);
        break;
      default:
        omdbResult = new OMDBResult(response.data);
    }

    if (!omdbResult.isRequestSuccesful()) {
      throw new IMDBError(omdbResult.error);
    }

    return omdbResult;
  }
}
