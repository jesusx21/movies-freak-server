import FixturesGenerator from 'fixtures-generator';

import * as schemas from './schemas';

const options = {
  optionalsProbability: 0.5
};

export default function buildFixtureGenerator() {
  const fixtureGenerator = new FixturesGenerator(schemas, options);

  return fixtureGenerator;
}
