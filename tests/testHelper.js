import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { v4 as uuid } from 'uuid';

import * as Classpuccino from '../classpuccino';
import buildFixtureGenerator from './fixtures';
import { Film, TVSerie } from '../app/moviesFreak/entities';
import getDatabase from '../database/factory';

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
