import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';

import DatabaseTestHelper from './database/testHelper';
import TestHelper from './testHelper';
import APITestHelper from './api/apiTestHelper';

chai.use(chaiAsPromised);
chai.use(sinonChai);

process.env.NODE_ENV ||= 'test';

globalThis.apiTestHelper = new APITestHelper();
globalThis.databaseTestHelper = new DatabaseTestHelper();
globalThis.testHelper = new TestHelper();
globalThis.expect = expect;
