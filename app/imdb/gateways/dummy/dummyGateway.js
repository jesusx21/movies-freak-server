/* eslint-disable no-unused-vars */
import DummyFilmResult from './result/filmResult';
import DummyTVEpisodeResult from './result/tvEpisodeResult';
import DummyTVSeasonResult from './result/tvSeasonResult';
import DummyTVSerieResult from './result/tvSerieResult';

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
