var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { get as getKey } from 'lodash';
import { IMDBError, IncorrectIMDBId, InvalidAPIKey } from '../../errors';
import { IMDBResultType, IMDBType } from '../../../../types/app';
import { FilmResult, Result, TVEpisodeResult, TVSeasonResult, TVSerieResult } from './result';
class OMDBGateway {
    constructor(host, apiKey) {
        this.host = host;
        this.apiKey = apiKey;
    }
    fetchFilmById(imdbId) {
        const query = {
            type: IMDBType.MOVIE,
            i: imdbId
        };
        return this.request(query, IMDBResultType.FILM);
    }
    fetchTVSerieById(imdbId) {
        const query = {
            type: IMDBType.SERIES,
            i: imdbId
        };
        return this.request(query, IMDBResultType.SERIE);
    }
    fetchTVSeasonBySerieId(serieImdbId, seasonNumber) {
        const query = {
            i: serieImdbId,
            type: IMDBType.SERIES,
            Season: seasonNumber
        };
        return this.request(query, IMDBResultType.SEASON);
    }
    fetchTVEpisodeById(imdbId) {
        const query = {
            i: imdbId,
            type: IMDBType.EPISODE
        };
        return this.request(query, IMDBResultType.EPISODE);
    }
    request(query, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = Object.keys(query)
                .map((key) => `${key}=${getKey(query, key)}`)
                .join('&');
            let response;
            try {
                response = yield axios
                    .get(`${this.host}?apikey=${this.apiKey}&${params}`);
            }
            catch (error) {
                response = error.response;
            }
            let omdbResult;
            switch (type) {
                case IMDBResultType.FILM:
                    omdbResult = new FilmResult(response.data);
                    break;
                case IMDBResultType.SERIE:
                    omdbResult = new TVSerieResult(response.data);
                    break;
                case IMDBResultType.SEASON:
                    omdbResult = new TVSeasonResult(response.data);
                    break;
                case IMDBResultType.EPISODE:
                    omdbResult = new TVEpisodeResult(response.data);
                    break;
                default:
                    omdbResult = new Result(response.data);
            }
            if (omdbResult.isRequestSuccesful()) {
                return omdbResult;
            }
            if (this.isIMDBIdError(omdbResult.error)) {
                throw new IncorrectIMDBId();
            }
            if (this.isInvalidAPIKeyError(omdbResult.error)) {
                throw new InvalidAPIKey();
            }
            throw new IMDBError(omdbResult.error);
        });
    }
    isIMDBIdError(error) {
        return error === 'Incorrect IMDb ID.';
    }
    isInvalidAPIKeyError(error) {
        return error === 'Invalid API key!';
    }
}
export default OMDBGateway;
//# sourceMappingURL=omdbGateway.js.map