/* eslint-disable no-unused-vars */
import DummyFilmResult from './filmResult';
import DummyTVSeasonResult from './tvSeasonResult';
import DummyTVSerieResult from './tvSerieResult';

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
}
