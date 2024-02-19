import { UUID } from '../../../types/common';
import { ReadOnlyField } from './errors';

class Entity {
  private _id?: UUID;
  private _createdAt?: Date;
  updatedAt?: Date;

  constructor(id?: UUID, createdAt?: Date, updatedAt?: Date) {
    this._id = id;
    this._createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  get id(): UUID | undefined {
    return this._id;
  }

  set id(id: UUID) {
    if (this._id) {
      throw new ReadOnlyField('id');
    }

    this._id = id;
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  set createdAt(date: Date) {
    if (this._createdAt) {
      throw new ReadOnlyField('createdAt');
    }

    this._createdAt = date;
  }
}

export default Entity;
