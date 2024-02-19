import InMemoryDatabase from '../database/stores/memory';
import SQLDatabase from '../database/stores/sql';
import { Json } from './common';

export type Database = SQLDatabase | InMemoryDatabase;

export interface QueryOptions {
  limit?: number;
  skip?: number;
  query?: Json,
  sort?: {
    field: string;
    order: string;
  }[];
};

export interface QueryResponse<T> {
  items: T[],
  totalItems: number
};

// Errors
export type DatabaseErrorParams = {
  error?: Json;
  name?: string;
  message?: string;
  info?: Json;
};

export enum DatabaseDriver {
  MEMORY = 'memory',
  SQL = 'sql'
};
