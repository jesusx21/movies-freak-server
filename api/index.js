import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';

import { MoviesFreakAPI } from './v1/resources';
import { HTTPError, HTTPInternalError } from './httpResponses';
import Presenters from './v1/presenters';

const RESOURCE_EVENTS_SUPPORTED = [
  'onPost',
  'onGet',
  'onPut',
  'onPatch',
  'onDelete'
];

const ENDPOINTS = {};

export default class MoviesFreakApp {
  constructor(database, imdbGateway) {
    this._app = express();

    this._database = database;
    this._imdb = imdbGateway;
    this._presenters = new Presenters();

    this._apiPath = '/movies-freak/api';
    this._router = express.Router();
  }

  build() {
    this._app.use(express.json());
    this._app.use(cors());
    this._app.use(this._setHeaders());

    if (!this._isTestEnv()) {
      this._app.use(this._setRequestLogger());
    }

    this._buildAPI();
    this._buildEndpoints();

    this._app.use('/movies-freak/api', this._router);
    this._app.use(this._setUnexpectedError());

    this._app.disable('x-powered-by');

    return this;
  }

  start(host, port) {
    this._app.listen(port, host, () => {
      // eslint-disable-next-line no-console
      console.log(`Movies Freak Server listening on ${host}:${port}`);
    });

    return this;
  }

  getDatabase() {
    return this._database;
  }

  getIMDBAccess() {
    return this._imdb;
  }

  _buildAPI() {
    const moviesFreakAPI = new MoviesFreakAPI(this);

    moviesFreakAPI.buildAPI();
  }

  registerResource(resourcePath, resourceInstance, middlewares = []) {
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

  _buildEndpoints() {
    Object.keys(ENDPOINTS).forEach((resource) => {
      const resourceRouter = express.Router();
      const endpoints = ENDPOINTS[resource];

      endpoints.forEach(({ path, resourceInstance, middlewares }) => {
        RESOURCE_EVENTS_SUPPORTED.forEach((eventName) => {
          const verb = eventName.substring(2).toLowerCase();

          if (!resourceInstance[eventName]) {
            return;
          }

          resourceRouter[verb](
            `/${path}`,
            middlewares,
            this._buildController(resourceInstance, eventName)
          );
        });
      });

      this._router.use(`/v1/${resource}`, resourceRouter);
    });
  }

  _setHeaders() {
    return (_req, res, next) => {
      res.append('X-Frame-Options', 'SAMEORIGIN');
      res.append('X-XSS-Protection', '1; mode=block');
      res.append('X-Content-Type-Options', 'nosniff');
      res.append('Content-Security-Policy', 'nosniff');

      next();
    };
  }

  _setUnexpectedError() {
    return (error, _req, res, next) => {
      if (error instanceof HTTPError) {
        res.status(error.statusCode).send(error.payload);

        return next();
      }

      const payload = { code: 'UNEXPECTED_ERROR' };

      if (this._isTestEnv()) {
        payload.error = error;
        // eslint-disable-next-line no-console
        console.error(error);
      }

      res.status(500).send(payload);

      return next(error);
    };
  }

  _setRequestLogger() {
    if (this._isProductionEnv()) {
      return morgan('combined');
    }

    return morgan('dev');
  }

  _isProductionEnv() {
    return process.env.NODE_ENV === 'production';
  }

  _isTestEnv() {
    return process.env.NODE_ENV !== 'production';
  }

  _buildController(resource, tokenName) {
    return async (req, res) => {
      let result;

      resource.setTitle('database', this._database);
      resource.setTitle('imdb', this._imdb);
      resource.setTitle('presenters', this._presenters);

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
