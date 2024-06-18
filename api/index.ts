import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';

import { Monopoly } from '../boardGame';
import { TokenNotUsed } from '../boardGame/errors';
import { Response } from '../boardGame/types';

import MoviesFreakAPI from './v1/resources';
import Presenters from './v1/presenters';
import { HTTPError, HTTPInternalError } from './httpResponses';
import { IMDBGateway } from '../types/app';
import { Database } from '../types/database';

class TokenNotSupported extends Error {}
class PlayNotSupported extends Error {}

interface EndpointParams {
  path: string;
  resourceInstance: Monopoly;
  middlewares: Function[];
}

const RESOURCE_EVENTS_SUPPORTED = [
  'onPost',
  'onGet',
  'onPut',
  'onPatch',
  'onDelete'
];

interface Endpoints {
  [resource: string]: EndpointParams[];
};

const ENDPOINTS: Endpoints = {};

class MoviesFreakApp {
  private app: express.Application;
  readonly database: Database;
  readonly imdb: IMDBGateway;
  private presenters: Presenters;
  private router: express.Router;

  constructor(database: Database, imdbGateway: IMDBGateway) {
    this.app = express();

    this.database = database;
    this.imdb = imdbGateway;
    this.presenters = new Presenters();

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

  start(host: string, port: number) {
    this.app.listen(port, host, () => {
      // eslint-disable-next-line no-console
      console.log(`Movies Freak Server listening on ${host}:${port}`);
    });

    return this;
  }

  getExpressApp() {
    return this.app;
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

  registerResource(resourcePath: string, resourceInstance: Monopoly, middlewares: Function[] = []) {
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

          let play: Function;

          switch (verb) {
            case 'delete':
              play = resourceRouter.delete.bind(resourceRouter);
              break;
            case 'get':
              play = resourceRouter.get.bind(resourceRouter);
              break;
            case 'post':
              play = resourceRouter.post.bind(resourceRouter);
              break;
            case 'put':
              play = resourceRouter.put.bind(resourceRouter);
              break;
            default:
              // throw new PlayNotSupported(verb);
              return;
          }

          const middlewaresBuilt = middlewares.map((middleware) => {
            return async (req: express.Request, res: express.Response, next: Function) => {
              try {
                await middleware(req, this, resourceInstance);
              } catch(error: any) {
                if (error instanceof HTTPError) {
                  return res.status(error.statusCode).send(error.payload);
                }

                return next(error);
              }

              next();
            }
          })

          try {
            play(
              `/${path}`,
              middlewaresBuilt,
              this.buildController(resourceInstance, eventName)
            );
          } catch (error: any) {
            if (error instanceof TokenNotUsed) {
              return;
            }

            throw error;
          }
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

  private buildController(resource: Monopoly, tokenName: string) {
    return async (req: express.Request, res: express.Response): Promise<express.Response> => {
      let result: Response;

      resource.setTitle('database', this.database);
      resource.setTitle('imdb', this.imdb);
      resource.setTitle('presenters', this.presenters);

      let moveToken: Function;

      switch (tokenName) {
        case 'onGet':
          moveToken = resource.onGet.bind(resource);
          break;
        case 'onPost':
          moveToken = resource.onPost.bind(resource);
          break;
        case 'onPut':
          moveToken = resource.onPut.bind(resource);
          break;
        case 'onDelete':
          moveToken = resource.onDelete.bind(resource);
          break;
        default:
          throw new TokenNotSupported(tokenName);
      }

      try {
        result = await moveToken(req);
      } catch (error: any) {
        if (error instanceof TokenNotUsed) {
          throw error;
        }

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
