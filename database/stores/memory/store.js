import cloneDeep from 'clone-deep';
import { v4 as uuid } from 'uuid';

import { NotFound } from '../errors';


export default class Store {
  constructor() {
    this._items = {};
  }

  async create(entity) {
    entity._id = uuid();
    entity._createdAt = new Date();
    entity._updatedAt = new Date();

    this._items[entity.id] = cloneDeep(entity);

    return entity;
  }

  async findById(entityId) {
    const entity = this._items[entityId];

    if (!entity) {
      throw new NotFound(entityId);
    }

    return cloneDeep(entity)
  }
}