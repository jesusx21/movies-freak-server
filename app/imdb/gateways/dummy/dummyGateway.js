/* eslint-disable no-unused-vars */

import {
  DummyFilmResult,
  DummyTVEpisodeResult,
  DummyTVSeasonResult,
  DummyTVSerieResult
} from './result';

export default class DummyGateway {
  fetchFilmById(_imdbId) {
    return new DummyFilmResult();
  }

  fetchTVSerieById(_imdbId) {
    return new DummyTVSerieResult();
  }

  fetchTVSeasonBySerieId(_serieImdbId, _seasonNumber) {
    return new DummyTVSeasonResult();
  }

  fetchTVEpisodeById(_imdbId) {
    return new DummyTVEpisodeResult();
  }
}
