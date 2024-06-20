import * as path from 'path';
import { readdirSync } from 'fs';

import { Json } from './types';
import { FunctionTestFailures, ModuleTestFailures, TestFailures } from './testFailures';
import TestResult from './testResult';
import Logger from './logger';
import { AssertionError } from 'assert';

class TestRunner {
  private readonly test: Json;

  constructor(test: Json) {
    this.test = test;
  }

  async start() {
    try {
      await this.test.setUp();
    } catch (error) {
      this.finish();
    }
  }

  async finish() {
    try {
      await this.test.tearDown();
    } catch (error) {
      throw error
    }
  }
}

export default class TestsRunner {
  private config: Json;
  private testFilesPaths: string[];
  private functionTestFailures: FunctionTestFailures[];
  private testResult: TestResult;
  private logger: Logger;

  constructor(config: Json, customTestsPath?: string) {
    this.config = config;
    this.testFilesPaths = customTestsPath ? [customTestsPath] : this.config.paths;
    this.functionTestFailures = [];
    this.logger = new Logger();
    this.testResult = new TestResult();
  }

  async run() {
    for (const filePath of this.testFilesPaths) {
      const testFilesPath = await this.getTestFilesPath(filePath);

      for (const testFileDir of testFilesPath) {
        const fullFilePath = path.join(process.cwd(), testFileDir);
        const TestClases = require(fullFilePath);
        const testModule = this.buildTestModule(fullFilePath);

        const testFailure = new TestFailures();
        const moduleFailures = testFailure.addModule(testModule);

        for (const Test of Object.values(TestClases)) {
          await this.runTest(Test, moduleFailures);
        }
      }
    }

    this.logger.logTestsFailures(this.functionTestFailures);
    this.logger.logTestsTotalsResult(this.testResult);
  }

  private buildTestModule(fullFilePath: string) {
    const modulePath = fullFilePath.split('/tests/')[1]
      .split('.')[0]
      .split('/')
      .join('.');

    return `tests.${modulePath}`;
  }

  private async runTest(Test: any, moduleFailures: ModuleTestFailures) {
    const test = new Test();
    const testClassName = test.constructor.name;

    if (!testClassName.endsWith('Test')) {
      return this;
    }


    this.logger.logModuleName(moduleFailures.module, testClassName);
    const classTestFailures = moduleFailures.addClassName(testClassName);

    const functions = Object.getOwnPropertyNames(Test.prototype);

    for (const functionName of functions) {
      if (!functionName.startsWith('test')) {
        continue;
      }

      const functionTestFailure = classTestFailures.addFunctionName(functionName);

      try {
        await test.setUp();
        await test[functionName]();
        await test.tearDown();

        this.logger.logSuccessTest(functionName);
        this.testResult.incrementTestPassed();
      } catch(error: any) {
        await test.tearDown();

        if (error instanceof AssertionError) {
          this.logger.logFailedTest(functionName);
          functionTestFailure.addFail(error);
          this.testResult.incrementtotalFailed();
        } else {
          this.logger.logErrorTest(functionName);
          functionTestFailure.addError(error);
          this.testResult.incrementTotalError();
        }
      }

      this.functionTestFailures.push(functionTestFailure);
    }
  }

  private async getTestFilesPath(testPath: string) {
    if (testPath.endsWith('.test.js') || testPath.endsWith('.test.ts')) {
      return [testPath];
    }

    const directoryPath = path.join(process.cwd(), testPath);
    const folders = readdirSync(directoryPath);

    let testFiles: string[] = [];

    for (const folder of folders) {
      if (folder.endsWith('.test.js') || folder.endsWith('.test.ts')) {
        testFiles.push(`${testPath}/${folder}`);

        // eslint-disable-next-line no-continue
        continue;
      }

      if (folder.includes('.')) {
        // eslint-disable-next-line no-continue
        continue;
      }

      const files = await this.getTestFilesPath(`${testPath}/${folder}`);

      testFiles = [...testFiles, ...files];
    }

    return testFiles;
  }
}
