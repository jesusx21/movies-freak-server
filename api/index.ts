import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';

import Database from '../database/stores/memory';
import IMDB from '../app/imdb/gateways/dummy/dummyGateway';
import MoviesFreakAPI from './v1/resources';
import Presenters from './v1/presenters';
import { HTTPError, HTTPInternalError } from './httpResponses';
import { Monopoly } from '../boardGame';
import { Titles } from './v1/interfaces';
import { MultipleRespponse, SingleRespponse } from '../boardGame/monopoly';

interface EndpointParams {
  path: string;
  resourceInstance: Monopoly<Titles>;
  middlewares: Function[];
}

const RESOURCE_EVENTS_SUPPORTED = [
  'onPost',
  'onGet',
  'onPut',
  'onPatch',
  'onDelete'
];

const ENDPOINTS = {};

class MoviesFreakApp {
  private app: express;
  private database: Database;
  private imdb: IMDB;
  private presenters: Presenters;
  private apiPath: string;
  private router: express.Router;

  constructor(database: Database, imdbGateway: IMDB) {
    this.app = express();

    this.database = database;
    this.imdb = imdbGateway;
    this.presenters = new Presenters();

    this.apiPath = '/movies-freak/api';
    this.router = express.Router();
  }

  build() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(this.setHeaders());

    if (!this.isTestEnv()) {
      this.app.use(this.setRequestLogger());
    }

    this.buildAPI();
    this.buildEndpoints();

    this.app.use('/movies-freak/api', this.router);
    this.app.use(this.setUnexpectedError());

    this.app.disable('x-powered-by');

    return this;
  }

  start(host: URL, port: number) {
    this.app.listen(port, host, () => {
      // eslint-disable-next-line no-console
      console.log(`Movies Freak Server listening on ${host}:${port}`);
    });

    return this;
  }

  getDatabase() {
    return this.database;
  }

  getIMDBAccess() {
    return this.imdb;
  }

  private buildAPI() {
    const moviesFreakAPI = new MoviesFreakAPI(this);

    moviesFreakAPI.buildAPI();
  }

  registerResource(resourcePath: string, resourceInstance: Monopoly<Titles>, middlewares: Function[] = []) {
    const [resource, path = ''] = resourcePath.split('/');

    if (!ENDPOINTS[resource]) {
      ENDPOINTS[resource] = [];
    }

    ENDPOINTS[resource].push({
      path,
      resourceInstance,
      middlewares
    });
  }

  private buildEndpoints() {
    Object.keys(ENDPOINTS).forEach((resource) => {
      const resourceRouter: express.Router = express.Router();
      const endpoints = ENDPOINTS[resource];

      endpoints.forEach(({ path, resourceInstance, middlewares }: EndpointParams) => {
        RESOURCE_EVENTS_SUPPORTED.forEach((eventName) => {
          const verb = eventName.substring(2).toLowerCase();

          if (!resourceInstance[eventName]) {
            return;
          }

          resourceRouter[verb](
            `/${path}`,
            middlewares,
            this.buildController(resourceInstance, eventName)
          );
        });
      });

      this.router.use(`/v1/${resource}`, resourceRouter);
    });
  }

  private setHeaders() {
    return (_req: express.Request, res: express.Response, next: Function) => {
      res.append('X-Frame-Options', 'SAMEORIGIN');
      res.append('X-XSS-Protection', '1; mode=block');
      res.append('X-Content-Type-Options', 'nosniff');
      res.append('Content-Security-Policy', 'nosniff');

      next();
    };
  }

  private setUnexpectedError() {
    return (error: Error, _req: express.Request, res: express.Response, next: Function) => {
      if (error instanceof HTTPError) {
        res.status(error.statusCode).send(error.payload);

        return next();
      }

      const payload: { code: string; error?: Error } = { code: 'UNEXPECTED_ERROR' };

      if (this.isTestEnv()) {
        payload.error = error;
        // eslint-disable-next-line no-console
        console.error(error);
      }

      res.status(500).send(payload);

      return next(error);
    };
  }

  private setRequestLogger() {
    if (this.isProductionEnv()) {
      return morgan('combined');
    }

    return morgan('dev');
  }

  private isProductionEnv() {
    return process.env.NODE_ENV === 'production';
  }

  private isTestEnv() {
    return process.env.NODE_ENV !== 'production';
  }

  private buildController(resource: Monopoly<Titles>, tokenName: string) {
    return async (req: express.Request, res: express.Router): Promise<express.Response> => {
      let result: SingleRespponse | MultipleRespponse;

      resource.setTitle('database', this.database);
      resource.setTitle('imdb', this.imdb);
      resource.setTitle('presenters', this.presenters);

      try {
        result = await resource[tokenName](req);
      } catch (error) {
        if (!(error instanceof HTTPError)) {
          // eslint-disable-next-line no-ex-assign
          error = new HTTPInternalError(error);
        }

        result = {
          status: error.statusCode,
          data: error.payload
        };
      }

      return res.status(result.status).send(result.data);
    };
  }
}

export default MoviesFreakApp;
