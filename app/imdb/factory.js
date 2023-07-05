import DummyGateway from './dummyGateway';
import OMDBGateway from './omdbGateway';
import { DriverNotSupported } from './errors';

export default function imdbFactory(driverName, host = null, apiKey = null) {
  if (driverName === 'dummy') {
    return new DummyGateway()
  }

  if (driverName === 'omdb') {
    return new OMDBGateway(host, apiKey);
  }

  throw new DriverNotSupported(driverName);
}