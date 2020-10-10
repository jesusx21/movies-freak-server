const { random } = require('lodash');
const FixturesGenerator = require('fixtures-generator');
const SCHEMAS = require('./schemas');

const TEST_CI_ENV = 'test_ci';

const options = {
  optionalsProbability: getOptionalsProbability()
};

function getOptionalsProbability() {
  const env = process.env.NODE_ENV;

  if (env === TEST_CI_ENV) return 0;

  return random(0.3, 0.7); // 0.5 ±0.2
}

module.exports = new FixturesGenerator(SCHEMAS, options);
