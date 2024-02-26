import cors from 'cors';
import express, { Application, Router } from 'express';
import morgan from 'morgan';

import {
  BoardGameRequest,
  BoardGameResponse,
  Header
} from './types';

export default abstract class BoardGameApp {
  private app: Application;
  private router: Router;
  private headers: Header[];

  constructor() {
    this.app = express();
    this.router = Router();
    this.headers = [];
  }

  addHeader(header: string, value: any) {
    this.headers.push({ header, value });

    return this;
  }

  addHeaders(headers: Header[]) {
    headers.forEach(({ header, value }) => this.addHeader(header, value));

    return this;
  }

  addMiddleware(middleware: Function) {
    this.app.use(
      async (req: BoardGameRequest, res: BoardGameResponse, next: Function) => {
        await middleware(req, res);
        next();
      }
    );

    return this;
  }

  abstract buildAPI(): void;

  parseJSON() {
    this.app.use(express.json());

    return this;
  }

  setCors() {
    this.app.use(cors());

    return this;
  }

  setLogger(format: string) {
    morgan(format);

    return this;
  }
}
