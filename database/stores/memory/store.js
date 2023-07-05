import cloneDeep from 'clone-deep';
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

    this._items[entity.id] = entityToSave;

    return entity;
  }

  async findById(entityId) {
    const entity = this._items[entityId];

    if (!entity) {
      throw new NotFound(entityId);
    }

    return cloneDeep(entity);
  }
}
