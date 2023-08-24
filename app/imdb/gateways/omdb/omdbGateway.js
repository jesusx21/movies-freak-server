import axios from 'axios';

import { IMDBError } from '../../errors';
import OMDBFilmResult from './result/filmResult';
import OMDBTVSerieResult from './result/tvSerieResult';
import OMDBTVSeasonResult from './result/tvSesonResult';
import OMDBTVEpisodeResult from './result/tvEpisodeResult';
import OMDBResult from './result/omdbResult';

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

  fetchTVEpisodeById(imdbId) {
    const query = {
      i: imdbId,
      type: 'episode'
    };

    return this._request(query, 'episode');
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
      case 'episode':
        omdbResult = new OMDBTVEpisodeResult(response.data);
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
