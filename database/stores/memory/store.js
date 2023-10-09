import { cloneDeep, get } from 'lodash';
import { v4 as uuid } from 'uuid';

import { NotFound } from '../errors';

export default class Store {
  constructor() {
    this._items = {};
  }

  async create(entity) {
    const entityToSave = cloneDeep(entity);

    entityToSave._id = uuid();
    entityToSave._createdAt = new Date();
    entityToSave._updatedAt = new Date();

    this._items[entityToSave.id] = entityToSave;

    return cloneDeep(entityToSave);
  }

  async update(entity) {
    if (!this._items[entity.id]) {
      throw new NotFound(entity.id);
    }

    // eslint-disable-next-line no-param-reassign
    entity._updatedAt = new Date();

    this._items[entity.id] = cloneDeep(entity);

    return cloneDeep(entity);
  }

  async findById(entityId) {
    const entity = this._items[entityId];

    if (!entity) {
      throw new NotFound(entityId);
    }

    return cloneDeep(entity);
  }

  async find(options = {}) {
    const items = Object.values(this._items);
    const skip = options.skip || 0;
    const limit = skip + (options.limit || items.length - 1);

    return {
      items: cloneDeep(items.slice(skip, limit)),
      totalItems: await this.count()
    };
  }

  async findOne(query) {
    const [entity] = Object.values(this._items)
      .sort((a, b) => b.createdAt - a.createdAt)
      .filter((item) => {
        return Object.keys(query)
          .reduce((succeed, key) => {
            return succeed && get(query, key) === get(item, key);
          }, true);
      });

    if (!entity) {
      throw new NotFound();
    }

    return cloneDeep(entity);
  }

  async count() {
    return Object.values(this._items)
      .length;
  }
}
