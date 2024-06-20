import  *  as colors from 'colors';
import { FunctionTestFailures, ModuleTestFailures, TestFailures } from './testFailures';
import TestResult from './testResult';

export default class Logger {
  constructor() {
    colors.enable;
  }

  logModuleName(module: string, tesClasstName: string) {
    return this.log(`\n${module}.${tesClasstName}`.gray.bold);
  }

  logSuccessTest(testName: string) {
    return this.log(`${testName.padEnd(99, '.')}.ok`.green)
  }

  logFailedTest(testName: string) {
    return this.log(`${testName.padEnd(99, '.')}.fail`.yellow)
  }

  logErrorTest(testName: string) {
    return this.log(`${testName.padEnd(99, '.')}.error`.red)
  }

  logTestsFailures(testFailures: FunctionTestFailures[]) {
    testFailures.forEach((testFailure: FunctionTestFailures) => {
      const { className } = testFailure.classTestFailure;
      const { functionName } = testFailure;

      if (testFailure.isFailed()) {
        this.log(`\n${className}.${functionName}`.yellow)
        this.log(`Fail: ${testFailure.fail?.stack}`.gray)
      }

      if (testFailure.isError()) {
        this.log(`\n${className}.${functionName}`.red)
        this.log(`Error: ${testFailure.error?.stack}`.gray)
      }
    });
  }

  logTestsTotalsResult(testsResult: TestResult) {
    this.log(`\n`)
      .log(`Tests passed: ${testsResult.totalPassed}`.green)
      .log(`Tests failed: ${testsResult.totalFailed}`.yellow)
      .log(`Error on tests: ${testsResult.totalError}`.red)
  }

  private log(message: any) {
    console.log(message);

    return this
  }
}
