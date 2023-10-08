/* eslint-disable no-param-reassign */
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';

import * as Classpuccino from '../classpuccino';
import buildFixtureGenerator from './fixtures';
import getDatabase from '../database/factory';
import {
  Film,
  TVSerie,
  TVSeason,
  TVEpisode,
  Watchlist,
  User,
  Session
} from '../app/moviesFreak/entities';
import { isEmpty } from 'lodash';

class SandboxNotInitialized extends Error {
  get name() {
    return 'SandboxNotInitialized';
  }
}

class OptionMissing extends Error {
  constructor(option) {
    super(`Option ${option} is missing`);
  }

  get name() {
    return 'OptionMissing';
  }
}

export default class TestCase extends Classpuccino.TestCase {
  constructor() {
    super(...arguments);

    this._fixturesGenerator = buildFixtureGenerator();
  }

  setUp() {
    super.setUp();

    this.createSandbox();
  }

  tearDown() {
    super.tearDown();

    this.restoreSandbox();
  }

  getDatabase() {
    return getDatabase('memory');
  }

  createSandbox() {
    if (this._sandbox) {
      return this._sandbox;
    }

    this._sandbox = sinon.createSandbox();

    return this._sandbox;
  }

  mockClass(klass, functionType = 'instance') {
    if (!this._sandbox) {
      throw new SandboxNotInitialized();
    }

    const target = functionType === 'instance' ? klass.prototype : klass;

    return this._sandbox.mock(target);
  }

  mockFunction(instance, functionName) {
    if (!this._sandbox) {
      throw new SandboxNotInitialized();
    }

    return this._sandbox.mock(instance)
      .expects(functionName);
  }

  restoreSandbox() {
    if (!this._sandbox) {
      return;
    }

    this._sandbox.restore();
  }

  stubFunction(target, fn) {
    if (!this._sandbox) {
      throw new SandboxNotInitialized();
    }

    return this._sandbox.stub(target, fn);
  }

  generateUUID() {
    return uuid();
  }

  createUser(db, data = {}) {
    const [userData] = this.generateFixtures({
      type: 'user',
      recipe: [data]
    });

    const user = new User(userData);
    user._password = userData.password;

    return db.users.create(user);
  }

  async createUsers(db) {
    const options = this._getFixturesGeneratorOptions(...arguments);
    const fixtures = this.generateFixtures({
      type: 'user',
      ...options
    });

    const result = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const userData of fixtures) {
      const user = new User(userData);

      user._password = userData.password;

      // eslint-disable-next-line no-await-in-loop
      result.push(await db.users.create(user));
    }

    return result;
  }

  async createFilm(db, data = {}) {
    const [filmData] = this.generateFixtures({
      type: 'film',
      recipe: [data]
    });
    const film = new Film(filmData);

    return db.films.create(film);
  }

  async createFilms(db) {
    const options = this._getFixturesGeneratorOptions(...arguments);
    const fixtures = this.generateFixtures({
      type: 'film',
      ...options
    });

    const result = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const filmData of fixtures) {
      const film = new Film(filmData);

      // eslint-disable-next-line no-await-in-loop
      result.push(await db.films.create(film));
    }

    return result;
  }

  createTVSerie(db, data = {}) {
    const [tvSerieData] = this.generateFixtures({
      type: 'tvSerie',
      recipe: [data]
    });
    const tvSerie = new TVSerie(tvSerieData);

    return db.tvSeries.create(tvSerie);
  }

  async createTVSeries(db) {
    const options = this._getFixturesGeneratorOptions(...arguments);
    const fixtures = this.generateFixtures({
      type: 'tvSerie',
      ...options
    });

    const result = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const tvSerieData of fixtures) {
      const tvSerie = new TVSerie(tvSerieData);

      // eslint-disable-next-line no-await-in-loop
      result.push(await db.tvSeries.create(tvSerie));
    }

    return result;
  }

  async createTVSeason() {
    const [db, ...params] = arguments;
    let [tvSerie, data = {}] = params;

    if (!(tvSerie instanceof TVSerie)) {
      data = tvSerie || {};
      tvSerie = await this.createTVSerie(db);
    }

    const [tvSeasonData] = this.generateFixtures({
      type: 'tvSeason',
      recipe: [{ ...data, tvSerieId: tvSerie.id }]
    });

    const tvSeason = new TVSeason(tvSeasonData);

    return db.tvSeasons.create(tvSeason);
  }

  async createTVSeasons() {
    const [db, ...params] = arguments;
    let [tvSerie, ...args] = params;

    if (!(tvSerie instanceof TVSerie)) {
      args = params;
      tvSerie = await this.createTVSerie(db);
    }

    const options = this._getFixturesGeneratorOptions(...args);
    const fixtures = this.generateFixtures({
      type: 'tvSeason',
      ...options
    });

    const result = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const tvSeasonData of fixtures) {
      const tvSeason = new TVSeason({ ...tvSeasonData, tvSerieId: tvSerie.id });

      // eslint-disable-next-line no-await-in-loop
      result.push(await db.tvSeasons.create(tvSeason));
    }

    return result;
  }

  async createTVEpisode() {
    const [db, ...params] = arguments;
    let [tvSeason, data = {}] = params;

    if (!(tvSeason instanceof TVSeason)) {
      data = tvSeason || {};
      tvSeason = await this.createTVSeason(db);
    }

    const [tvEpisodeData] = this.generateFixtures({
      type: 'tvEpisode',
      recipe: [{
        ...data,
        tvSerieId: tvSeason.tvSerieId,
        tvSeasonId: tvSeason.id
      }]
    });

    const tvEpisode = new TVEpisode(tvEpisodeData);

    return db.tvEpisodes.create(tvEpisode);
  }

  async createTVEpisodes() {
    const [db, ...params] = arguments;
    let [tvSeason, ...args] = params;

    if (!(tvSeason instanceof TVSeason)) {
      args = params;
      tvSeason = await this.createTVSeason(db);
    }

    const options = this._getFixturesGeneratorOptions(...args);
    const fixtures = this.generateFixtures({
      type: 'tvEpisode',
      ...options
    });

    const result = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const tvEpisodeData of fixtures) {
      const tvEpisode = new TVEpisode({
        ...tvEpisodeData,
        tvSerieId: tvSeason.tvSerieId,
        tvSeasonId: tvSeason.id
      });

      // eslint-disable-next-line no-await-in-loop
      result.push(await db.tvEpisodes.create(tvEpisode));
    }

    return result;
  }

  async createWatchlist(db, data = {}) {
    const [watchlistData] = this.generateFixtures({
      type: 'watchlist',
      recipe: [data]
    });

    const watchlist = new Watchlist(watchlistData);

    return db.watchlists.create(watchlist);
  }

  async createWhatchlists(db) {
    const options = this._getFixturesGeneratorOptions(...arguments);
    const fixtures = this.generateFixtures({
      type: 'watchlist',
      ...options
    });

    const result = [];

    // For is use instead of map to make sure the creation respects the index order
    // eslint-disable-next-line no-restricted-syntax
    for (const watchlistData of fixtures) {
      const watchlist = new Watchlist(watchlistData);

      // eslint-disable-next-line no-await-in-loop
      result.push(await db.watchlists.create(watchlist));
    }

    return result;
  }

  async createSession(db, user) {
    const session = new Session({ user });

    session.generateToken('password')
      .activateToken();

    return db.sessions.create(session);
  }

  generateFixtures(options = {}) {
    const { type } = options;
    let { recipe, quantity } = options;

    if (!type) {
      throw new OptionMissing('type');
    }

    if (!recipe) {
      recipe = [];
    }

    if (!quantity) {
      quantity = isEmpty(recipe) ? 1 : recipe.length;
    }

    return this._fixturesGenerator.generate({ type, quantity, recipe });
  }

  _getFixturesGeneratorOptions() {
    const options = [...arguments].reduce((prev, param) => {
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
