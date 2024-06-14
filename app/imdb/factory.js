import DummyGateway from './gateways/dummy/dummyGateway';
import OMDBGateway from './gateways/omdb/omdbGateway';
import { DriverNotSupported, MissingIMDBCredentials } from './errors';
function imdbFactory(driverName, host, apiKey) {
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
//# sourceMappingURL=factory.js.map