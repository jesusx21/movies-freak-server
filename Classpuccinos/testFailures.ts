import { Json } from './types';

export class FunctionTestFailures {
  readonly classTestFailure: ClassTestFailures;
  readonly functionName: string;
  fail?: Json;
  error?: Json;

  constructor(classTestFailure: ClassTestFailures, functionName: string) {
    this.classTestFailure = classTestFailure;
    this.functionName = functionName;
  }

  isFailed() {
    return !!this.fail;
  }

  isError() {
    return !!this.error;
  }

  addFail(fail: Json) {
    this.fail = fail;

    return this;
  }

  addError(error: Json) {
    this.error = error;

    return this;
  }
}

export class ClassTestFailures {
  className: string;
  readonly moduleTestFailure: ModuleTestFailures;
  private functions: {
    [key: string]: FunctionTestFailures
  };

  constructor(moduleTestFailure: ModuleTestFailures, className: string) {
    this.moduleTestFailure = moduleTestFailure;
    this.className = className;
    this.functions = {};
  }

  addFunctionName(functionName: string) {
    const functionNames = this.functions[functionName];

    if (!!functionNames) return functionNames;

    this.functions[functionName] = new FunctionTestFailures(this, functionName);

    return this.functions[functionName];
  }
}

export class ModuleTestFailures {
  module: string;
  private classes: {
    [key: string]: ClassTestFailures
  };

  constructor(module: string) {
    this.module = module;
    this.classes = {};
  }

  addClassName(className: string) {
    const classNames = this.classes[className];

    if (!!classNames) return classNames;

    this.classes[className] = new ClassTestFailures(this, className);

    return this.classes[className];
  }
}

export class TestFailures {
  private modules: {
    [key: string]: ModuleTestFailures
  };

  constructor() {
    this.modules = {}
  }

  addModule(moduleName: string) {
    const module = this.modules[moduleName];

    if (!!module) return module;

    this.modules[moduleName] = new ModuleTestFailures(moduleName);

    return this.modules[moduleName];
  }

  forEach(fn: Function) {
    Object.keys(this.modules)
      .forEach((key: string) => fn(key, this.modules[key]));
  }
}
