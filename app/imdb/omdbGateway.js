import axios from 'axios';

import OMDBResult from './omdbResult';
import { IMDBError } from './errors';

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

    return this._request(query);
  }

  async _request(query) {
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

    const omdbResult = new OMDBResult(response.data);

    if (!omdbResult.isRequestSuccesful()) {
      throw new IMDBError(omdbResult.error);
    }

    return omdbResult;
  }
}