import {
  FilmResult,
  TVEpisodeResult,
  TVSeasonResult,
  TVSerieResult
} from './result';

class DummyIMDBGateway {
  async fetchFilmById(_imdbI: string) {
    return new FilmResult();
  }

  async fetchTVSerieById(_imdbId: string) {
    return new TVSerieResult();
  }

  async fetchTVSeasonBySerieId(_serieImdbId: string, _seasonNumber: number) {
    return new TVSeasonResult();
  }

  async fetchTVEpisodeById(_imdbId: string) {
    return new TVEpisodeResult();
  }
}

export default DummyIMDBGateway;
