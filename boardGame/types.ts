import express from 'express';

export type BoardGameErrorParams = {
  error?: Error;
  name?: string;
  message?: string;
  info?: Json;
};

export enum HTTPMethods {
  DELETE = 'delete',
  GET = 'get',
  POST = 'post',
  PUT = 'put'
}

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

export type Json = {
  [key: string]: any
};

export type Header = {
  header: string,
  value: any
};

export interface BoardGameRequest extends express.Request {};
export interface BoardGameResponse extends express.Response {};

export interface SingleResponse {
  status: HTTPStatusCode;
  data: Json;
};

export interface MultipleResponse {
  status: HTTPStatusCode;
  data: {
    skip: number;
    limit: number;
    totalItems: number;
    items: Json[]
  };
};

export type Response = SingleResponse | MultipleResponse;

export type Request = {
  body: { [key: string]: any };
  params: { [key: string]: any };
  query: { [key: string]: any };
};
