import FixturesGenerator from 'fixtures-generator';

import * as schemas from './schemas';

export interface FixturesGeneratorOptions {
  type: string;
  quantity?: number;
  recipe?: {}[],
}

const options = {
  optionalsProbability: 0.5
};

function buildFixtureGenerator(): FixturesGenerator {
  const fixtureGenerator = new FixturesGenerator(schemas, options);

  return fixtureGenerator;
}

export default buildFixtureGenerator;
