import DummyResult from './dummyResult';

export default class DummyGateway {
  fetchFilmById(_imdbId) {
    return new DummyResult();
  }
}