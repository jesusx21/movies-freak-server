import { expect } from 'chai';

import TestCase from '../../../testHelper';

import imdbFactory from '../../../../app/imdb/factory';
import DummyGateway from '../../../../app/imdb/dummyGateway';
import OMDBGateway from '../../../../app/imdb/omdbGateway';
import { DriverNotSupported } from '../../../../app/imdb/errors';

export default class IMDBFactoryTest extends TestCase {
  testReturnDummyGateway() {
    const gateway = imdbFactory('dummy');

    expect(gateway).to.be.instanceOf(DummyGateway);
  }

  testReturnOMDBGateway() {
    const gateway = imdbFactory('omdb');

    expect(gateway).to.be.instanceOf(OMDBGateway);
  }

  testThrowErrorOnUnsupportedDriver() {
    expect(
      () => imdbFactory('invalid-driver')
    ).to.throw(DriverNotSupported);
  }
}
