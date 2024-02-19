import { cloneDeep, get as getKey} from 'lodash';
import { v4 as uuid } from 'uuid';

import { Entity } from '../../../types/entities';
import { Json, UUID } from '../../../types/common';
import { NotFound } from '../errors';
import { QueryOptions, QueryResponse } from '../../../types/database';

class Store<T extends Entity> {
  private items: {
    [key: UUID]: T
  };

  constructor() {
    this.items = {};
  }

  async create(entity: T): Promise<T> {
    const entityToSave = cloneDeep(entity);
    const entityId = uuid();

    Object.assign(
      entityToSave,
      {
        _id: entityId,
        _createdAt: new Date(),
        _updatedAt: new Date()
      }
    );

    this.items[entityId] = entityToSave;

    return cloneDeep(entityToSave);
  }

  async update(entity: T): Promise<T> {
    if (!entity.id || !this.items[entity.id]) {
      throw new NotFound({ id: entity.id });
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
    const query: Json = options.query || {};
    const items = Object.values(this.items);
    const skip = options.skip || 0;
    const limit = skip + (options.limit || items.length - 1);

    const result = applyFilter<T>(items, query);

    return {
      items: result.slice(skip, limit),
      totalItems: await this.count(query)
    };
  }

  async findOne(query: {}): Promise<T> {
    const items = Object.values(this.items)
      .sort((a: any, b: any) => b.createdAt - a.createdAt);

    const [entity] = applyFilter<T>(items, query);

    if (!entity) {
      throw new NotFound(query);
    }

    return cloneDeep(entity);
  }

  async count(query = {}) {
    const items = Object.values(this.items);

    return applyFilter<T>(items, query)
      .length;
  }
}

function applyFilter<T>(data: T[], filter: Json) {
  const items = cloneDeep(data);

  return items.filter((item) => {
    return Object.keys(filter)
      .reduce(
        (succeed, key) => succeed && getKey(filter, key) === getKey(item, key),
        true
      );
  });
}

export default Store;
