var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';
import { TokenNotUsed } from '../boardGame/errors';
import MoviesFreakAPI from './v1/resources';
import Presenters from './v1/presenters';
import { HTTPError, HTTPInternalError } from './httpResponses';
class TokenNotSupported extends Error {
}
class PlayNotSupported extends Error {
}
const RESOURCE_EVENTS_SUPPORTED = [
    'onPost',
    'onGet',
    'onPut',
    'onPatch',
    'onDelete'
];
;
const ENDPOINTS = {};
class MoviesFreakApp {
    constructor(database, imdbGateway) {
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
    start(host, port) {
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
    buildAPI() {
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
    buildEndpoints() {
        Object.keys(ENDPOINTS).forEach((resource) => {
            const resourceRouter = express.Router();
            const endpoints = ENDPOINTS[resource];
            endpoints.forEach(({ path, resourceInstance, middlewares }) => {
                RESOURCE_EVENTS_SUPPORTED.forEach((eventName) => {
                    const verb = eventName.substring(2).toLowerCase();
                    let play;
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
                    try {
                        play(`/${path}`, middlewares, this.buildController(resourceInstance, eventName));
                    }
                    catch (error) {
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
    setHeaders() {
        return (_req, res, next) => {
            res.append('X-Frame-Options', 'SAMEORIGIN');
            res.append('X-XSS-Protection', '1; mode=block');
            res.append('X-Content-Type-Options', 'nosniff');
            res.append('Content-Security-Policy', 'nosniff');
            next();
        };
    }
    setUnexpectedError() {
        return (error, _req, res, next) => {
            if (error instanceof HTTPError) {
                res.status(error.statusCode).send(error.payload);
                return next();
            }
            const payload = { code: 'UNEXPECTED_ERROR' };
            if (this.isTestEnv()) {
                payload.error = error;
                // eslint-disable-next-line no-console
                console.error(error);
            }
            res.status(500).send(payload);
            return next(error);
        };
    }
    setRequestLogger() {
        if (this.isProductionEnv()) {
            return morgan('combined');
        }
        return morgan('dev');
    }
    isProductionEnv() {
        return process.env.NODE_ENV === 'production';
    }
    isTestEnv() {
        return process.env.NODE_ENV !== 'production';
    }
    buildController(resource, tokenName) {
        return (req, res) => __awaiter(this, void 0, void 0, function* () {
            let result;
            resource.setTitle('database', this.database);
            resource.setTitle('imdb', this.imdb);
            resource.setTitle('presenters', this.presenters);
            let moveToken;
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
                result = yield moveToken(req);
            }
            catch (error) {
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
        });
    }
}
export default MoviesFreakApp;
//# sourceMappingURL=index.js.map