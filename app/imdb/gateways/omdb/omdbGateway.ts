import axios from 'axios';

import { IMDBError } from '../../errors';
import {
  OMDBFilmResult,
  OMDBResult,
  OMDBTVEpisodeResult,
  OMDBTVSeasonResult,
  OMDBTVSerieResult
} from './result';

interface queryObject {
  type: 'movie' | 'series' | 'episode',
  i?: string;
  Season?: number;
}

class OMDBGateway {
  private host?: URL;
  private apiKey?: string;

  constructor(host?: URL, apiKey?: string) {
    this.host = host;
    this.apiKey = apiKey;
  }

  fetchFilmById(imdbId: string) {
    const query: queryObject = {
      type: 'movie',
      i: imdbId
    };

    return this.request(query, 'film');
  }

  fetchTVSerieById(imdbId: string) {
    const query: queryObject = {
      type: 'series',
      i: imdbId
    };

    return this.request(query, 'serie');
  }

  fetchTVSeasonBySerieId(serieImdbId: string, seasonNumber: number) {
    const query: queryObject = {
      i: serieImdbId,
      type: 'series',
      Season: seasonNumber
    };

    return this.request(query, 'season');
  }

  fetchTVEpisodeById(imdbId) {
    const query: queryObject = {
      i: imdbId,
      type: 'episode'
    };

    return this.request(query, 'episode');
  }

  async request(query: queryObject, type: string) {
    const params = Object.keys(query)
      .map((key) => `${key}=${query[key]}`)
      .join('&');

    let response: any: {};

    try {
      response = await axios
        .get(`${this.host}?apikey=${this.apiKey}&${params}`);
    } catch (error) {
      response = error.response;
    }

    let omdbResult: any;

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

export default OMDBGateway;
