/* eslint-disable no-param-reassign */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { v4 as uuid } from 'uuid';

import * as Classpuccino from '../classpuccino';
import buildFixtureGenerator from './fixtures';
import getDatabase from '../database/factory';
import {
  Film,
  TVSerie,
  TVSeason,
  TVEpisode,
  Watchlist
} from '../app/moviesFreak/entities';

chai.use(chaiAsPromised);
chai.use(sinonChai);

class SandboxNotInitialized extends Error {
  get name() {
    return 'SandboxNotInitialized';
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

  async createFilm(db, data = {}) {
    const [filmData] = this._fixturesGenerator.generate({
      type: 'film',
      recipe: [data]
    });

    const film = new Film(filmData);

    return db.films.create(film);
  }

  async createFilms(db) {
    const options = this._getFixturesGeneratorOptions(...arguments);
    options.type = 'film';

    const fixtures = this._fixturesGenerator.generate(options);

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
    const [tvSerieData] = this._fixturesGenerator.generate({
      type: 'tvSerie',
      recipe: [data]
    });

    const tvSerie = new TVSerie(tvSerieData);

    return db.tvSeries.create(tvSerie);
  }

  async createTVSeries(db) {
    const options = this._getFixturesGeneratorOptions(...arguments);
    options.type = 'tvSerie';

    const fixtures = this._fixturesGenerator.generate(options);

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

    const [tvSeasonData] = this._fixturesGenerator.generate({
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
    options.type = 'tvSeason';

    const fixtures = this._fixturesGenerator.generate(options);

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

    const [tvEpisodeData] = this._fixturesGenerator.generate({
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
    options.type = 'tvEpisode';

    const fixtures = this._fixturesGenerator.generate(options);

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
    const [watchlistData] = this._fixturesGenerator.generate({
      type: 'watchlist',
      recipe: [data]
    });

    const watchlist = new Watchlist(watchlistData);

    return db.watchlists.create(watchlist);
  }

  async createWhatchlists(db) {
    const options = this._getFixturesGeneratorOptions(...arguments);
    options.type = 'watchlist';

    const fixtures = this._fixturesGenerator.generate(options);

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

    options.recipe ||= [];
    options.quantity ||= options.recipe.length;

    return options;
  }
}
