import sinon from 'sinon';
import { v4 as uuid } from 'uuid';

import { Film } from '../app/movies-freak/entities';
import InMemoryDatabase from '../database/stores/memory';

class SandboxNotInitialized extends Error {}

export default class TestHelper {
  getDatabase() {
    return new InMemoryDatabase();
  }

  createSandbox() {
    if (this._sandbox) {
      return this._sandbox;
    }

    this._sandbox = sinon.createSandbox();
    
    return this._sandbox
  }

  mockClass(klass) {
    if (!this._sandbox) {
      throw new SandboxNotInitialized();
    }

    return this._sandbox.mock(klass);
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

  createFilm(db, name, plot) {
    const film = new Film({ name, plot });

    return db.films.create(film);
  }
}