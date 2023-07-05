import DummyResult from './dummyResult';

export default class DummyGateway {
  // eslint-disable-next-line no-unused-vars
  fetchFilmById(_imdbId) {
    return new DummyResult();
  }
}
