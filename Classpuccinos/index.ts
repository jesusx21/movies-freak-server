import TestRunner from './testRunner';
import { ClasspuccinoNotInitialized, ClasspuccinoUnknownError } from './errors';
import { Json } from './types';

class Classpuccino {
  async run() {
    const configPath = `${process.cwd()}/../classpuccino.config.json`;

    let config: Json;

    try {
      config = require(configPath);
    } catch (error: any) {
      if (error.code === 'MODULE_NOT_FOUND') {
        throw new ClasspuccinoNotInitialized();
      }

      throw new ClasspuccinoUnknownError(error);
    }

    const testRunner = new TestRunner(config);

    return testRunner.run();
  }
}

const resolve = () => {
  console.log('Done!');
  process.exit(0);
};

const reject = (error: Json) => {
  console.info('Error runing tests');
  console.error('Error:', error);
  process.exit(1);
};

const classpuccino = new Classpuccino();

classpuccino.run()
  .then(resolve)
  .catch(reject);
