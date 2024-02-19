import TestCase from '../../../testHelper';

import imdbFactory from '../../../../app/imdb/factory';
import DummyGateway from '../../../../app/imdb/gateways/dummy/dummyGateway';
import OMDBGateway from '../../../../app/imdb/gateways/omdb/omdbGateway';
import { DriverNotSupported, MissingIMDBCredentials } from '../../../../app/imdb/errors';

export class IMDBFactoryTest extends TestCase {
  testReturnDummyGateway() {
    const gateway = imdbFactory('dummy');

    this.assertThat(gateway).isInstanceOf(DummyGateway);
  }

  testReturnOMDBGateway() {
    const gateway = imdbFactory('omdb', 'http://fake-host.com', 'fake-api-key');

    this.assertThat(gateway).isInstanceOf(OMDBGateway);
  }

  testThrowErrorWhenCredentialsForOMDBAreNotSent() {
    this.assertThat(
      () => imdbFactory('omdb')
    ).willThrow(MissingIMDBCredentials)
  }

  testThrowErrorOnUnsupportedDriver() {
    this.assertThat(
      () => imdbFactory('invalid-driver')
    ).willThrow(DriverNotSupported);
  }
}
