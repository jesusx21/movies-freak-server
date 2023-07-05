import imdbFactory from '../../../../app/imdb/factory';
import DummyGateway from '../../../../app/imdb/dummyGateway';
import OMDBGateway from '../../../../app/imdb/omdbGateway';
import { DriverNotSupported } from '../../../../app/imdb/errors';

describe('IMDB', () => {
  describe('Factory', () => {
    it('should return a dummy gateway when driver name is dummy', () => {
      const gateway = imdbFactory('dummy');

      expect(gateway).to.be.instanceOf(DummyGateway);
    });

    it('should return an omdb gateway when driver name is omdb', () => {
      const gateway = imdbFactory('omdb');

      expect(gateway).to.be.instanceOf(OMDBGateway);
    });

    it('should throw error on unsupported driver', async () => {
      expect(
        () => imdbFactory('invalid-driver')
      ).to.throw(DriverNotSupported);
    });
  });
});
