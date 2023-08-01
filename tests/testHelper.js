import sinon from 'sinon';
import { v4 as uuid } from 'uuid';

import { Film, TVSerie } from '../app/moviesFreak/entities';
import InMemoryDatabase from '../database/stores/memory';
import buildFixtureGenerator from './fixtures';

class SandboxNotInitialized extends Error {}

export default class TestHelper {
  constructor() {
    this._fixturesGenerator = buildFixtureGenerator();
  }

  getDatabase() {
    return new InMemoryDatabase();
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

  restoreSandbox() {
    if (!this._sandbox) {
      throw new SandboxNotInitialized();
    }

    return this._sandbox.restore();
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

  createTVSerie(db, data = {}) {
    const [tvSerieData] = this._fixturesGenerator.generate({
      type: 'tvSerie',
      recipe: [data]
    });

    const tvSerie = new TVSerie(tvSerieData);

    return db.tvSeries.create(tvSerie);
  }
}
