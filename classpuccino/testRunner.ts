import path from 'path';
import vm from 'vm';
import { readdirSync, readFileSync } from 'fs';

import { Json } from './types';
// import { createRequire } from 'module';

export default class TestRunner {
  private config: Json;
  private testFilesPaths: string[];

  constructor(config: Json) {
    this.config = config;
    this.testFilesPaths = this.config.paths;
  }

  async run() {
    for (const filePath of this.testFilesPaths) {
      const testFilesPath = await this.getTestFilesPath(filePath);

      for (const testFileDir of testFilesPath) {
        const fullFilePath = path.join(process.cwd(), testFileDir);
        // const require = createRequire(process.cwd());
        const TestClases = require(fullFilePath);
        console.log(fullFilePath, {TestClases});
      }
    }
  }

  loadTestFile(filePath: string) {
    console.log({filePath})
    const file = readFileSync(filePath);
    console.log({file})
    const test = new vm.Script(file.toString());
    console.log({test})

    test.runInThisContext();
  }

  private async getTestFilesPath(testPath: string) {
    const directoryPath = path.join(process.cwd(), testPath);

    if (directoryPath.endsWith('.test.js') || directoryPath.endsWith('.test.ts')) {
      return [directoryPath];
    }

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
