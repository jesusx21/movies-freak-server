import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';

import { MoviesFreakAPI } from './v1/resources';
import { HTTPError } from './httpResponses';

const RESOURCE_EVENTS_SUPPORTED = [
  'onPost',
  'onGet',
  'onPut',
  'onPatch',
  'onDelete'
];

export default class MoviesFreakApp {
  constructor(database) {
    this._app = express();
    this._database = database;

    this._apiPath = '/movies-freak/api';
    this._router = express.Router();
  }

  build() {
    this._app.use(express.json());
    this._app.use(cors());
    this._app.use(this._setHeaders());
    this._app.use(this._setRequestLogger());

    this._buildAPI();

    this._app.use('/movies-freak/api', this._router);
    this._app.use(this._setUnexpectedError());
    
    this._app.disable('x-powered-by');

    return this;
  }

  start(host, port) {
    this._app.listen(port, host, () => {
      console.log(`Movies Freak Server listening on ${host}:${port}`);
    });

    return this;
  }

  getDatabase() {
    return this._database;
  }

  _buildAPI() {
    const moviesFreakAPI = new MoviesFreakAPI(this);

    moviesFreakAPI.buildAPI();
  }

  registerResource(resourcePath, resourceInstance, middlewares = []) {
    const resourceRouter = express.Router();

    RESOURCE_EVENTS_SUPPORTED.forEach((eventName) => {
      const event = resourceInstance[eventName];
      const verb = eventName.substring(2).toLowerCase()

      if (!event) {
        return;
      }

      resourceRouter[verb](
        `/`,
        middlewares,
        this._buildController(event.bind(resourceInstance))
      )
    });

    this._router.use(`/v1/${resourcePath}`, resourceRouter);
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
        res.status(error.statusCode).send(error.payload)
        
        return next();
      }

      const payload = { code: 'UNEXPECTED_ERROR' };

      if (this.isTestEnv()) {
        payload.error = error;
      }

      res.status(500).send(payload);

      next(error);
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

  _buildController(fn) {
    return async (req, res) => {
      let result;
      
      try {
        result = await fn(req)
      } catch (error) {
        result = {
          status: error.statusCode,
          data: error.payload
        }
      }

      return res.status(result.status).send(result.data);
    }
  }
}