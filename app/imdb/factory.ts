import DummyGateway from './gateways/dummy/dummyGateway';
import OMDBGateway from './gateways/omdb/omdbGateway';
import { DriverNotSupported, MissingIMDBCredentials } from './errors';

export type IMDBGateway = DummyGateway | OMDBGateway;

function imdbFactory(driverName: string, host?: string, apiKey?: string) {
  if (driverName === 'dummy') {
    return new DummyGateway();
  }

  if (driverName === 'omdb') {
    if (!host || !apiKey) {
      throw new MissingIMDBCredentials();
    }

    return new OMDBGateway(host, apiKey);
  }

  throw new DriverNotSupported(driverName);
}

export default imdbFactory;
