export type UUID = `${string}-${string}-${string}-${string}-${string}` | string;

export type Json = {
  [key: string]: any
};

export enum Environment {
  TEST = 'test',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  PRODUCTION = 'production'
};
