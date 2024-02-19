import FixturesGenerator from './generator';
import schemas from './schemas';

const options = {
  optionalsProbability: 0.5
};

function buildFixtureGenerator() {
  const fixtureGenerator = new FixturesGenerator(schemas, options);

  return fixtureGenerator;
}

export default buildFixtureGenerator;
