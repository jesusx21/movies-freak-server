export type Json = {
  [key: string]: any
};

export type ClasspuccinoErrorParams = {
  error?: Json;
  name?: string;
  message?: string;
  info?: Json;
};

export type ErrorAndFails = {
  [key: string]: any
};

export type FailTestResponse = {
  fail: Json;
  error: Json;
};

export type Config = {
  paths: string[]
};
