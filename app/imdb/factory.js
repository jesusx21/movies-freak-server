import DummyGateway from './gateways/dummy/dummyGateway';
import OMDBGateway from './gateways/omdb/omdbGateway';
import { DriverNotSupported } from './errors';

export default function imdbFactory(driverName, host = null, apiKey = null) {
  if (driverName === 'dummy') {
    return new DummyGateway();
  }

  if (driverName === 'omdb') {
    return new OMDBGateway(host, apiKey);
  }

  throw new DriverNotSupported(driverName);
}
