/* eslint-disable no-unused-vars */
import DummyResult from './dummyResult';

export default class DummyGateway {
  fetchFilmById(_imdbId) {
    return new DummyResult();
  }

  fetchTVSerieById(_imdbId) {
    return new DummyResult();
  }
}
