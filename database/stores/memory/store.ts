import { cloneDeep, get } from 'lodash';
import { v4 as uuid } from 'uuid';

import Entity from '../../../app/moviesFreak/entities/entity';
import { NotFound } from '../errors';
import { QueryOptions, QueryResponse } from '../interfaces';
import { UUID } from '../../../typescript/customTypes';

class Store<T> {
  private items: {};

  constructor() {
    this.items = {};
  }

  async create(entity: Entity): Promise<T> {
    const entityToSave: Entity = cloneDeep(entity);
    const entityId = uuid();

    entityToSave.id = entityId;
    entityToSave.createdAt = new Date();
    entityToSave.updatedAt = new Date();

    this.items[entityId] = entityToSave;

    return cloneDeep(entityToSave);
  }

  async update(entity: Entity): Promise<T> {
    if (!entity.id || !this.items[entity.id]) {
      throw new NotFound(entity.id);
    }

    entity.updatedAt = new Date();

    this.items[entity.id] = cloneDeep(entity);

    return cloneDeep(entity);
  }

  async findById(entityId: UUID): Promise<T> {
    const entity = this.items[entityId];

    if (!entity) {
      throw new NotFound(entityId);
    }

    return cloneDeep(entity);
  }

  async find(options: QueryOptions = {}): Promise<QueryResponse<T>> {
    const query = options.query || {};
    const items: {}[] = Object.values(this.items);
    const skip = options.skip || 0;
    const limit = skip + (options.limit || items.length - 1);

    const result = applyFilter(items, query);

    return {
      items: result.slice(skip, limit),
      totalItems: await this.count(query)
    };
  }

  async findOne(query: {}): Promise<T> {
    const items = Object.values(this.items)
      .sort((a: any, b: any) => b.createdAt - a.createdAt);
    const [entity]: [T] = applyFilter(items, query);

    if (!entity) {
      throw new NotFound();
    }

    return cloneDeep(entity);
  }

  async count(query = {}) {
    const items: {}[] = Object.values(this.items);

    return applyFilter(items, query)
      .length;
  }
}

function applyFilter(data: {}[], filter:{}) {
  const items = cloneDeep(data);

  return items.filter((item: {}) => {
    return Object.keys(filter)
      .reduce((succeed, key) => {
        return succeed && get(filter, key) === get(item, key);
      }, true);
  });
}

export default Store;
