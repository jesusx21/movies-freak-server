import BoardGameApp from '../boardGame/boardgame';
import Presenters from './v1/presenters';
import { Database } from '../types/database';
import { IMDBGateway } from '../types/app';
import { BoardGameRequest, BoardGameResponse } from '../boardGame/types';
import { Environment } from '../types/common';

export class MoviesFreakApp extends BoardGameApp {
  private database: Database;
  private imdb: IMDBGateway;
  private presenters: Presenters
  private environment: Environment

  constructor(
    database: Database,
    imdbGateway: IMDBGateway,
    environment: Environment
  ) {
    super();

    this.database = database;
    this.imdb = imdbGateway;
    this.presenters = new Presenters();

    this.environment = environment;
  }

  build() {
    this.parseJSON();
    this.setCors();
    this.setHeaders();
    this.setRequestLogger();
  }

  private setHeaders() {
    this.addHeaders([
      { header: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { header: 'X-XSS-Protection', value: '1; mode=block' },
      { header: 'X-Content-Type-Options', value: 'nosniff' },
      { header: 'Content-Security-Policy', value: 'nosniff' }
    ])
  }

  private setRequestLogger() {
    if (this.isProductionEnv()) {
      this.setLogger('combined');
    } else if (this.isDevelopmentEnv()) {
      this.setLogger('dev');
    }
  }

  private isTestEnv() {
    return this.environment === Environment.TEST;
  }

  private isDevelopmentEnv() {
    return this.environment === Environment.STAGING ||
      this.environment === Environment.DEVELOPMENT;
  }

  private isProductionEnv() {
    return this.environment === Environment.PRODUCTION;
  }
}
