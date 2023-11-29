import TestCase from '../../../../testHelper';

import Serializer, {
  field,
  MissingSchema
} from '../../../../../database/stores/sql/serializer';

class FakeEntity {
  constructor(args: {}) {
    Object.assign(this, args);
  }
}

export default class SerializerTest extends TestCase {
  serializer: Serializer<FakeEntity>;

  setUp() {
    this.serializer = Serializer.init<FakeEntity>(FakeEntity);
  }

  testReturnInstanceOfSerializer() {
    this.assertThat(
      Serializer.init(FakeEntity)
    ).isInstanceOf(Serializer);
  }

  testAddFieldsToSerializer() {
    this.serializer.addSchema(
      field('id'),
      field('name'),
      field('created_at', { from: 'createdAt' }),
      field('updated_at', { from: 'updatedAt' })
    );

    this.assertThat(this.serializer.schema['id']).isEmpty();
    this.assertThat(this.serializer.schema['name']).isEmpty();
    this.assertThat(this.serializer.schema['created_at']).isEqual({ from: 'createdAt' });
    this.assertThat(this.serializer.schema['updated_at']).isEqual({ from: 'updatedAt' });
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

    this.assertThat(entity).isInstanceOf(FakeEntity);
    this.assertThat(entity['id']).isEqual(data.id);
    this.assertThat(entity['name']).isEqual(data.name);
    this.assertThat(entity['createdAt']).isEqual(data.created_at);
    this.assertThat(entity['updatedAt']).isEqual(data.updated_at);
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

    this.assertThat(data['id']).isEqual(entity['id']);
    this.assertThat(data['name']).isEqual(entity['name']);
    this.assertThat(data['created_at']).isEqual(entity['createdAt']);
    this.assertThat(data['updated_at']).isEqual(entity['updatedAt']);
  }

  testThrowErrorWhenSerializingFromJSON() {
    const data = {
      id: 1,
      name: 'Test',
      created_at: new Date(),
      updated_at: new Date()
    };

    this.assertThat(
      () => this.serializer.fromJSON(data)
    ).willThrow(MissingSchema);
  }

  testThrowErrorWhenSerializingToJSON() {
    const entity = new FakeEntity({
      id: 1,
      name: 'Test',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.assertThat(
      () => this.serializer.toJSON(entity)
    ).willThrow(MissingSchema);
  }
}
