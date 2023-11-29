import TestCase from '../../../testHelper';

import imdbFactory from '../../../../app/imdb/factory';
import DummyGateway from '../../../../app/imdb/gateways/dummy/dummyGateway';
import OMDBGateway from '../../../../app/imdb/gateways/omdb/omdbGateway';
import { DriverNotSupported } from '../../../../app/imdb/errors';

export class IMDBFactoryTest extends TestCase {
  testReturnDummyGateway() {
    const gateway = imdbFactory('dummy');

    this.assertThat(gateway).isInstanceOf(DummyGateway);
  }

  testReturnOMDBGateway() {
    const gateway = imdbFactory('omdb');

    this.assertThat(gateway).isInstanceOf(OMDBGateway);
  }

  testThrowErrorOnUnsupportedDriver() {
    this.assertThat(
      () => imdbFactory('invalid-driver')
    ).willThrow(DriverNotSupported);
  }
}
