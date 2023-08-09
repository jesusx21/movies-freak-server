/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { AssertionError } from 'chai';
import colors from 'colors';
import fs from 'fs';
import path from 'path';

export default class TestRunner {
  constructor(testDir) {
    this.testDir = testDir;

    this.errorAndFails = {};

    this.totalPassed = 0;
    this.totalFailed = 0;
    this.totalErrors = 0;
  }

  async run() {
    const testFilesPath = await this._getTestFilesPath();

    // eslint-disable-next-line no-restricted-syntax
    for (const testFileDir of testFilesPath) {
      const Test = this._loadFile(testFileDir);
      // eslint-disable-next-line no-await-in-loop
      await this._runTest(Test);
    }

    Object.keys(this.errorAndFails).forEach((testClassName) => {
      Object.keys(this.errorAndFails[testClassName]).forEach(functionName => {
        const { fail, error } = this.errorAndFails[testClassName][functionName];

        if (fail) {
          console.log(`\n${testClassName}.${functionName}`.yellow);
          console.log('Fail:'.gray, fail.stack.gray);
        }

        if (error) {
          console.log(`\n${testClassName}.${functionName}`.red);
          console.log('Error:'.gray, error.stack.gray);
        }
      });
    });

    console.info('\n');
    console.info(`Tests passed: ${this.totalPassed}`.green);
    console.info(`Tests failed: ${this.totalFailed}`.yellow);
    console.error(`Error on tests: ${this.totalErrors}`.red);
  }

  async _runTest(Test) {
    colors.enable;

    const test = new Test();
    const testClassName = test.constructor.name;
    const functions = Object.getOwnPropertyNames(Test.prototype);

    this.errorAndFails[testClassName] = {};

    console.log(`\n${test.constructor.name}`.gray.bold);
    // eslint-disable-next-line no-restricted-syntax
    for (const functionName of functions) {
      if (!functionName.startsWith('test')) {
        // eslint-disable-next-line no-continue
        continue;
      }

      this.errorAndFails[testClassName][functionName] = {};

      try {
        await test.setUp();
        await test[functionName]();
        await test.tearDown();

        console.log(`${functionName.padEnd(99, '.')}.ok`.green);

        this.totalPassed += 1;
      } catch (error) {
        await test.tearDown();

        if (error instanceof AssertionError) {
          console.log(`${functionName.padEnd(99, '.')}.fail`.yellow);

          this.errorAndFails[testClassName][functionName].fail = error;
          this.totalFailed += 1;
        } else {
          console.log(`${functionName.padEnd(99, '.')}.error`.red);
          this.errorAndFails[testClassName][functionName].error = error;
          this.totalErrors += 1;
        }
      }
    }
  }

  async _getTestFilesPath(testDir) {
    const testPath = testDir || this.testDir;
    const directoryPath = path.join(__dirname, `${testPath}`);
    const folders = fs.readdirSync(directoryPath);

    let testFiles = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const folder of folders) {
      if (folder.endsWith('.test.js')) {
        testFiles.push(`${testPath}/${folder}`);

        // eslint-disable-next-line no-continue
        continue;
      }

      if (folder.includes('.')) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // eslint-disable-next-line no-await-in-loop
      const files = await this._getTestFilesPath(`${testPath}/${folder}`);

      testFiles = [...testFiles, ...files];
    }

    return testFiles;
  }

  _loadFile(testFileDir) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const TestFile = require(testFileDir);

    return TestFile.default ? TestFile.default : TestFile;
  }
}
