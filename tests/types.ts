import { Database } from '../types/database';

export interface UseCase {
  database: Database;
  new (database: Database, ...args: any[]): UseCase;
  constructor(database: Database, ...args: any[]): UseCase;
  execute(): Promise<any>;
};
