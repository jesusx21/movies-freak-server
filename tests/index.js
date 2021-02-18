process.env.NODE_ENV = process.env.NODE_ENV === 'test_ci' ? process.env.NODE_ENV : 'test';

const ROOT_PATH = require('app-root-path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinonChai = require('sinon-chai');
const chaiDateTime = require('chai-datetime');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.use(chaiDateTime);
chai.should();

global.ROOT_PATH = ROOT_PATH;
