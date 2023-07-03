import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

import DatabaseTestHelper from './database/testHelper';

chai.use(chaiAsPromised);
chai.use(sinonChai);

globalThis.databaseTestHelper = new DatabaseTestHelper();
globalThis.expect = expect;