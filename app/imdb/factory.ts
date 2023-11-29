import DummyGateway from './gateways/dummy/dummyGateway';
import OMDBGateway from './gateways/omdb/omdbGateway';
import { DriverNotSupported } from './errors';

function imdbFactory(driverName: string, host?: string, apiKey?: string) {
  if (driverName === 'dummy') {
    return new DummyGateway();
  }

  if (driverName === 'omdb') {
    return new OMDBGateway(host, apiKey);
  }

  throw new DriverNotSupported(driverName);
}

export default imdbFactory;
