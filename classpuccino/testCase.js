import Assertions from './assertions';

export default class TestCase {
  constructor() {
    this._assertions = new Assertions();
  }

  async setUp() {
    // pass
  }

  async tearDown() {
    // pass
  }

  assertThat(actual) {
    return this._assertions.assertThat(actual);
  }
}
