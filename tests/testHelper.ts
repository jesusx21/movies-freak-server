/* eslint-disable no-param-reassign */
import FixturesGenerator from 'fixtures-generator';
import sinon from 'sinon';
import * as Classpuccino from '../classpuccino';
import { isEmpty } from 'lodash';
import { v4 as uuid } from 'uuid';

import buildFixtureGenerator, { FixturesGeneratorOptions } from './fixtures';
import Database from '../database/stores/memory';
import getDatabase from '../database/factory';
import { FilmParams } from '../app/moviesFreak/entities/film';
import { PasswordHashed, UserParams } from '../app/moviesFreak/entities/user';
import { TVEpisodeParams } from '../app/moviesFreak/entities/tvEpisode';
import { TVSeasonParams } from '../app/moviesFreak/entities/tvSeason';
import { TVSerieParams } from '../app/moviesFreak/entities/tvSerie';
import { WatchlistParams } from '../app/moviesFreak/entities/watchlist';
import {
  Film,
  TVSerie,
  TVSeason,
  TVEpisode,
  Watchlist,
  User,
  Session
} from '../app/moviesFreak/entities';

class SandboxNotInitialized extends Error {
  get name() {
    return 'SandboxNotInitialized';
  }
}

interface UserFixture extends UserParams {
  password: PasswordHashed;
}

class TestCase extends Classpuccino.TestCase {
  private fixturesGenerator: FixturesGenerator;
  private sandbox?: sinon.Sandbox;

  constructor() {
    super();

    this.fixturesGenerator = buildFixtureGenerator();
  }

  setUp() {
    this.createSandbox();
  }

  tearDown() {
    this.restoreSandbox();
  }

  getDatabase() {
    return getDatabase('memory', 'testing');
  }

  createSandbox() {
    if (this.sandbox) {
      return this.sandbox;
    }

    this.sandbox = sinon.createSandbox();

    return this.sandbox;
  }

  mockClass(klass: Function, functionType = 'instance') {
    if (!this.sandbox) {
      throw new SandboxNotInitialized();
    }

    const target = functionType === 'instance' ? klass.prototype : klass;

    return this.sandbox.mock(target);
  }

  mockFunction(instance: any, functionName: string) {
    if (!this.sandbox) {
      throw new SandboxNotInitialized();
    }

    return this.sandbox.mock(instance)
      .expects(functionName);
  }

  restoreSandbox() {
    if (!this.sandbox) {
      return;
    }

    this.sandbox.restore();
  }

  stubFunction(target: Function, fn: string) {
    if (!this.sandbox) {
      throw new SandboxNotInitialized();
    }

    return this.sandbox.stub(target, fn);
  }

  generateUUID() {
    return uuid();
  }

  createUser(database: Database, data = {}) {
    const [userData] = this.generateFixtures<UserFixture>({
      type: 'user',
      recipe: [data]
    });

    const user = new User(userData);
    user.password = userData.password;

    return database.users.create(user);
  }

  async createUsers(database: Database, ...args: any[]) {
    const options = this.getFixturesGeneratorOptions(...args);
    const fixtures = this.generateFixtures<UserFixture>({
      type: 'user',
      ...options
    });

    const result: User[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const userData of fixtures) {
      const user = new User(userData);

      user.password = userData.password;
      // eslint-disable-next-line no-await-in-loop
      const userSaved = await database.users.create(user);

      result.push(userSaved);
    }

    return result;
  }

  async createFilm(database: Database, data?: FilmParams) {
    const recipe = data ? [data] : []
    const [filmData] = this.generateFixtures<FilmParams>({
      recipe,
      type: 'film'
    });
    const film = new Film(filmData);

    return database.films.create(film);
  }

  async createFilms(database: Database, ...args: any[]) {
    const options = this.getFixturesGeneratorOptions(...args);
    const fixtures = this.generateFixtures<FilmParams>({
      type: 'film',
      ...options
    });

    const result: Film[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const filmData of fixtures) {
      const film = new Film(filmData);
      const filmSaved = await database.films.create(film);

      // eslint-disable-next-line no-await-in-loop
      result.push(filmSaved);
    }

    return result;
  }

  createTVSerie(database: Database, data?: TVSerieParams) {
    const recipe = data ? [data] : [];

    const [tvSerieData] = this.generateFixtures<TVSerieParams>({
      recipe,
      type: 'tvSerie'
    });
    const tvSerie = new TVSerie(tvSerieData);

    return database.tvSeries.create(tvSerie);
  }

  async createTVSeries(db: Database, ...args: any[]) {
    const options = this.getFixturesGeneratorOptions(...args);
    const fixtures = this.generateFixtures<TVSerieParams>({
      type: 'tvSerie',
      ...options
    });

    const result: TVSerie[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const tvSerieData of fixtures) {
      const tvSerie = new TVSerie(tvSerieData);

      // eslint-disable-next-line no-await-in-loop
      result.push(await db.tvSeries.create(tvSerie));
    }

    return result;
  }

  async createTVSeason(database: Database, ...args: any[]) {
    let tvSerie: TVSerie;
    let data: TVSeasonParams = args[0];

    if (args[0] instanceof TVSerie) {
      [tvSerie, data ] = args;
    } else {
      tvSerie = await this.createTVSerie(database);
    }

    const [tvSeasonData] = this.generateFixtures<TVSeasonParams>({
      type: 'tvSeason',
      recipe: [{ ...data, tvSerieId: tvSerie.id }]
    });

    const tvSeason = new TVSeason(tvSeasonData);

    return database.tvSeasons.create(tvSeason);
  }

  async createTVSeasons(database: Database, ...args: any[]) {
    let tvSerie: TVSerie;
    let params = args;

    if (args[0] instanceof TVSerie) {
      [tvSerie, ...params] = args;
    } else {
      tvSerie = await this.createTVSerie(database);
    }

    const options = this.getFixturesGeneratorOptions(...args);
    const fixtures = this.generateFixtures<TVSeasonParams>({
      type: 'tvSeason',
      ...options
    });

    const result: TVSeason[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const tvSeasonData of fixtures) {
      const tvSeason = new TVSeason({ ...tvSeasonData, tvSerieId: tvSerie.id });

      // eslint-disable-next-line no-await-in-loop
      result.push(await database.tvSeasons.create(tvSeason));
    }

    return result;
  }

  async createTVEpisode(database: Database, ...args: any[]) {
    let tvSeason: TVSeason;
    let data: TVEpisodeParams = args[0];

    if (args[0] instanceof TVSeason) {
      [tvSeason, data] = args;
    } else {
      tvSeason = await this.createTVSeason(database);
    }

    const [tvEpisodeData] = this.generateFixtures<TVEpisode>({
      type: 'tvEpisode',
      recipe: [{
        ...data,
        tvSerieId: tvSeason.tvSerieId,
        tvSeasonId: tvSeason.id
      }]
    });

    const tvEpisode = new TVEpisode(tvEpisodeData);

    return database.tvEpisodes.create(tvEpisode);
  }

  async createTVEpisodes(database: Database, ...args: any[]) {
    let tvSeason: TVSeason;
    let data: TVEpisodeParams = args[0];

    if (args[0] instanceof TVSeason) {
      [tvSeason, data] = args;
    } else {
      tvSeason = await this.createTVSeason(database);
    }

    const options = this.getFixturesGeneratorOptions(...args);
    const fixtures = this.generateFixtures<TVEpisodeParams>({
      type: 'tvEpisode',
      ...options
    });

    const result: TVEpisode[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const tvEpisodeData of fixtures) {
      const tvEpisode = new TVEpisode({
        ...tvEpisodeData,
        tvSerieId: tvSeason.tvSerieId,
        tvSeasonId: tvSeason.id
      });

      // eslint-disable-next-line no-await-in-loop
      result.push(await database.tvEpisodes.create(tvEpisode));
    }

    return result;
  }

  async createWatchlist(database: Database, data?: Watchlist) {
    const recipe = data ? [data] : [];
    const [watchlistData] = this.generateFixtures<WatchlistParams>({
      recipe,
      type: 'watchlist'
    });

    const watchlist = new Watchlist(watchlistData);

    return database.watchlists.create(watchlist);
  }

  async createWhatchlists(database: Database, ...args: any[]) {
    const options = this.getFixturesGeneratorOptions(...args);
    const fixtures = this.generateFixtures<WatchlistParams>({
      type: 'watchlist',
      ...options
    });

    const result: Watchlist[] = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const watchlistData of fixtures) {
      const watchlist = new Watchlist(watchlistData);

      // eslint-disable-next-line no-await-in-loop
      result.push(await database.watchlists.create(watchlist));
    }

    return result;
  }

  async createSession(database: Database, user: User) {
    const session = new Session({ user });

    session.generateToken()
      .activateToken();

    return database.sessions.create(session);
  }

  generateFixtures<T>(options: FixturesGeneratorOptions): T[] {
    const { type } = options;
    let { recipe, quantity } = options;

    if (!recipe) {
      recipe = [];
    }

    if (!quantity) {
      quantity = isEmpty(recipe) ? 1 : recipe.length;
    }

    return this.fixturesGenerator.generate({ type, quantity, recipe });
  }

  private getFixturesGeneratorOptions(...args: any[]) {
    const options = [...args].reduce((prev, param) => {
      if (typeof param === 'number') {
        Object.assign(prev, { quantity: param });
      }

      if (Array.isArray(param)) {
        Object.assign(prev, { recipe: param });
      }

      return prev;
    }, {});

    return options;
  }
}

export default TestCase;
