import { Json } from '../types/common';

export type BoardGameErrorParams = {
  error?: Error;
  name?: string;
  message?: string;
  info?: {};
};

export enum HTTPStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  PRECONDITION_FAILED = 412,
  UNEXPECTED_ERROR = 500
};

export interface SingleResponse {
  status: HTTPStatusCode;
  data: Json;
};

export interface MultipleRespponse {
  status: HTTPStatusCode;
  data: {
    skip: number;
    limit: number;
    totalItems: number;
    items: Json[]
  };
};

export type Response = SingleResponse | MultipleRespponse;

export type Request = {
  body: { [key: string]: any };
  params: { [key: string]: any };
  query: { [key: string]: any };
};
