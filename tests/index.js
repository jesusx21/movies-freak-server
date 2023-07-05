import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

import DatabaseTestHelper from './database/testHelper';
import TestHelper from './testHelper';

chai.use(chaiAsPromised);
chai.use(sinonChai);

globalThis.databaseTestHelper = new DatabaseTestHelper();
globalThis.testHelper = new TestHelper();
globalThis.expect = expect;
