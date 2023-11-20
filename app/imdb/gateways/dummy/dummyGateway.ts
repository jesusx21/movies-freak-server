import {
  DummyFilmResult,
  DummyTVEpisodeResult,
  DummyTVSeasonResult,
  DummyTVSerieResult
} from './result';

class DummyGateway {
  async fetchFilmById(_imdbI: string) {
    return new DummyFilmResult();
  }

  async fetchTVSerieById(_imdbId: string) {
    return new DummyTVSerieResult();
  }

  async fetchTVSeasonBySerieId(_serieImdbId: string, _seasonNumber: number) {
    return new DummyTVSeasonResult();
  }

  async fetchTVEpisodeById(_imdbId: string) {
    return new DummyTVEpisodeResult();
  }
}

export default DummyGateway;
