import { Json } from '../types/common';
import { DependencyNotFound, MethodNotImplemented } from './errors';
import { HTTPMethods, Request, Response, SingleResponse } from './types';

class Monopoly {
  private dependencies: Json;

  constructor() {
    this.dependencies = {};
  }

  async onPost(_request: Request): Promise<SingleResponse> {
    throw new MethodNotImplemented(HTTPMethods.POST);
  }

  async onGet(_request: Request): Promise<Response> {
    throw new MethodNotImplemented(HTTPMethods.GET);
  }

  async onPut(_request: Request): Promise<SingleResponse> {
    throw new MethodNotImplemented(HTTPMethods.PUT);
  }

  async onDelete(_request: Request): Promise<SingleResponse> {
    throw new MethodNotImplemented(HTTPMethods.DELETE);
  }

  setDependency(dependencyName: string, dependencyValue: object) {
    this.dependencies[dependencyName] = dependencyValue;
  }

  getDependency(dependencyName: string) {
    const dependency = this.dependencies[dependencyName];

    if (!dependency) {
      throw new DependencyNotFound(dependencyName);
    }

    return dependency;
  }

  getDependencies() {
    return this.dependencies;
  }
}

export default Monopoly;
