import { expect } from 'chai';

import TestCase from '../../../../testHelper';

import Serializer, {
  field,
  InvalidField,
  MissingSchema
} from '../../../../../database/stores/sql/serializer';

class FakeEntity {
  constructor(args) {
    Object.assign(this, args);
  }
}

export default class SerializerTest extends TestCase {
  setUp() {
    this.serializer = Serializer.init(FakeEntity);
  }

  testReturnInstanceOfSerializer() {
    expect(
      Serializer.init(FakeEntity)
    ).to.be.instanceOf(Serializer);
  }

  testReturnSerializerWithTargetEntity() {
    expect(this.serializer._target).to.be.equal(FakeEntity);
  }

  testAddFieldsToSerializer() {
    this.serializer.addSchema(
      field('id'),
      field('name'),
      field('created_at', { from: 'createdAt' }),
      field('updated_at', { from: 'updatedAt' })
    );

    expect(this.serializer._schema.id).to.be.empty;
    expect(this.serializer._schema.name).to.be.empty;
    expect(this.serializer._schema.created_at).to.be.deep.equal({ from: 'createdAt' });
    expect(this.serializer._schema.updated_at).to.be.deep.equal({ from: 'updatedAt' });
  }

  testReturnEntityInstanceOnSerializingFromJSON() {
    this.serializer.addSchema(
      field('id'),
      field('name'),
      field('created_at', { from: 'createdAt' }),
      field('updated_at', { from: 'updatedAt' })
    );

    const data = {
      id: 1,
      name: 'Test',
      created_at: new Date(),
      updated_at: new Date()
    };

    const entity = this.serializer.fromJSON(data);

    expect(entity).to.be.instanceOf(FakeEntity);
    expect(entity.id).to.be.equal(data.id);
    expect(entity.name).to.be.equal(data.name);
    expect(entity.createdAt).to.be.deep.equal(data.created_at);
    expect(entity.updatedAt).to.be.deep.equal(data.updated_at);
  }

  testReturnJSONOnSerializingFromEntity() {
    this.serializer.addSchema(
      field('id'),
      field('name'),
      field('created_at', { from: 'createdAt' }),
      field('updated_at', { from: 'updatedAt' })
    );

    const entity = new FakeEntity({
      id: 1,
      name: 'Test',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const data = this.serializer.toJSON(entity);

    expect(data.id).to.be.equal(entity.id);
    expect(data.name).to.be.equal(entity.name);
    expect(data.created_at).to.be.deep.equal(entity.createdAt);
    expect(data.updated_at).to.be.deep.equal(entity.updatedAt);
  }

  testThrowErrorOnInvalidField() {
    expect(
      () => this.serializer.addSchema(
        field('id'),
        field('name'),
        'created_at'
      )
    ).to.throw(InvalidField).with.property('message', 'Invalid field created_at');
  }

  testThrowErrorWhenSerializingFromJSON() {
    const data = {
      id: 1,
      name: 'Test',
      created_at: new Date(),
      updated_at: new Date()
    };

    expect(
      () => this.serializer.fromJSON(data)
    ).to.throw(MissingSchema).with.property('message', 'Schema has not been provided');
  }

  testThrowErrorWhenSerializingToJSON() {
    const entity = new FakeEntity({
      id: 1,
      name: 'Test',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    expect(
      () => this.serializer.toJSON(entity)
    ).to.throw(MissingSchema).with.property('message', 'Schema has not been provided');
  }
}
