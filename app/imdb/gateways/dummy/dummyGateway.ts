import {
  DummyFilmResult,
  DummyTVEpisodeResult,
  DummyTVSeasonResult,
  DummyTVSerieResult
} from './result';

class DummyGateway {
  fetchFilmById(_imdbI: string) {
    return new DummyFilmResult();
  }

  fetchTVSerieById(_imdbId: string) {
    return new DummyTVSerieResult();
  }

  fetchTVSeasonBySerieId(_serieImdbId: string, _seasonNumber: number) {
    return new DummyTVSeasonResult();
  }

  fetchTVEpisodeById(_imdbId: string) {
    return new DummyTVEpisodeResult();
  }
}

export default DummyGateway;
