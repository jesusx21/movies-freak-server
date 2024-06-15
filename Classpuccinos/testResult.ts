export default class TestResult {
  totalPassed: number;
  totalFailed: number;
  totalError: number;

  constructor() {
    this.totalPassed = 0;
    this.totalFailed = 0;
    this.totalError = 0;
  }

  incrementTestPassed() {
    this.totalPassed += 1

    return this;
  }

  incrementtotalFailed() {
    this.totalFailed += 1

    return this;
  }

  incrementTotalError() {
    this.totalError += 1

    return this;
  }
}
