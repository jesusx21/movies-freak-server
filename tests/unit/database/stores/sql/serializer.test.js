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

describe('Database - Stores - SQL', () => {
  describe('Serializer', () => {
    let serializer;

    beforeEach(() => {
      serializer = Serializer.init(FakeEntity);
    });

    it('should return an instance of serializer', () => {
      expect(
        Serializer.init(FakeEntity)
      ).to.be.instanceOf(Serializer);
    });

    it('should return a serializer with a target entity', () => {
      expect(serializer._target).to.be.equal(FakeEntity);
    });

    it('should add fields to serializer', () => {
      serializer.addSchema(
        field('id'),
        field('name'),
        field('created_at', { from: 'createdAt' }),
        field('updated_at', { from: 'updatedAt' }),
      )

      expect(serializer._schema.id).to.be.empty;
      expect(serializer._schema.name).to.be.empty;
      expect(serializer._schema.created_at).to.be.deep.equal({ from: 'createdAt' });
      expect(serializer._schema.updated_at).to.be.deep.equal({ from: 'updatedAt' });
    });

    it('should return entity instance on serializing from json', () => {
      serializer.addSchema(
        field('id'),
        field('name'),
        field('created_at', { from: 'createdAt' }),
        field('updated_at', { from: 'updatedAt' }),
      );

      const data = {
        id: 1,
        name: 'Test',
        created_at: new Date(),
        updated_at: new Date()
      };

      const entity = serializer.fromJSON(data);

      expect(entity).to.be.instanceOf(FakeEntity);
      expect(entity.id).to.be.equal(data.id);
      expect(entity.name).to.be.equal(data.name);
      expect(entity.createdAt).to.be.deep.equal(data.created_at);
      expect(entity.updatedAt).to.be.deep.equal(data.updated_at);
    });

    it('should return entity instance on serializing from json', () => {
      serializer.addSchema(
        field('id'),
        field('name'),
        field('created_at', { from: 'createdAt' }),
        field('updated_at', { from: 'updatedAt' }),
      );

      const entity = new FakeEntity({
        id: 1,
        name: 'Test',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const data = serializer.toJSON(entity);

      expect(data.id).to.be.equal(entity.id);
      expect(data.name).to.be.equal(entity.name);
      expect(data.created_at).to.be.deep.equal(entity.createdAt);
      expect(data.updated_at).to.be.deep.equal(entity.updatedAt);
    });

    it('should return error when field is invalid', () => {
      try {
        serializer.addSchema(
          field('id'),
          field('name'),
          'created_at'
        )
        throw new Error('invalid path')
      } catch (error) {
        expect(error).to.be.instanceOf(InvalidField);
        expect(error.message).to.be.equal('Invalid field created_at');
      }
    });

    it('should return error when serializing from json', () => {
      const data = {
        id: 1,
        name: 'Test',
        created_at: new Date(),
        updated_at: new Date()
      };

      try {
        serializer.fromJSON(data);
        throw new Error('invalid path')
      } catch (error) {
        expect(error).to.be.instanceOf(MissingSchema);
        expect(error.message).to.be.equal('Schema has not been provided');
      }
    });

    it('should return error when serializing to json', () => {
      const entity = new FakeEntity({
        id: 1,
        name: 'Test',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      try {
        serializer.toJSON(entity);
        throw new Error('invalid path')
      } catch (error) {
        expect(error).to.be.instanceOf(MissingSchema);
        expect(error.message).to.be.equal('Schema has not been provided');
      }
    });
  });
});