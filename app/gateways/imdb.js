const RootPath = require('app-root-path');
const axios = require('axios');
const omit = require('lodash.omit');

const { IMDBError } = require('./errors');

const config = require(`${RootPath}/infrastructure/config`);

class IMDBGateway {
  constructor() {
    this._host = config.imdb.host;
    this._apiKey = config.imdb.apiKey;
  }

  fetchMovies(data) {
    const params = {};

    if (data.imdbId) params.i = data.imdbId;
    if (data.name) params.s = data.name;
    if (data.year) params.y = data.year;
    if (data.page) params.page = data.page;

    return this._request(params);
  }

  async _request(data) {
    const params = Object.keys(data)
      .map((key) => `${key}=${data[key]}`)
      .join('&');

    const { data: result } = await axios.get(`${this._host}?apikey=${this._apiKey}&${params}&type=movie`);
    const isRequestSuccesfull = JSON.parse(result.Response.toLowerCase());

    if (!isRequestSuccesfull) return Promise.reject(new IMDBError(result.Error));

    return result.Search ? result.Search : [omit({ ...result }, 'Response' )];
  }
}

module.exports = IMDBGateway;
