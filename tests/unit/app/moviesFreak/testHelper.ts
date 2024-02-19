import TestCase from '../../../testHelper';
import { Database } from '../../../../types/database';
import { UseCase } from '../../../types';

export default class MoviesFreakTestCase extends TestCase {
  protected buildUseCase(Target: UseCase | any, database: Database, ...args: any[]) {
    return new Target(database, ...args)
  }

  protected runUseCase(Target: UseCase | any, database: Database, ...args: any[]) {
    const useCase = new Target(database, ...args);

    return useCase.execute();
  }
}
