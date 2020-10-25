const { expect } = require('chai');
const Joi = require('joi');

const buildEntity = require(`${ROOT_PATH}/domain/entities/build-entity`)
const testUtils = require(`${ROOT_PATH}/tests/utils`);

const SCHEMA = Joi.object({
  id: Joi.string()
    .required(),
  name: Joi.string()
    .required()
});

describe('Domain - Entities',() => {
  it('should resolves schema validation', async () => {
    const entity = await buildEntity(SCHEMA, { id: '1', name: 'Test' });

    expect(entity).to.exist;
  });

  it('should rejects schema validation', () => {
    return buildEntity(SCHEMA, { name: 'Test' })
      .then(testUtils.onUnexpectedPath)
      .catch(testUtils.validateError('ENTITY_DATA_INVALID'));
  });

  it('should build the entity', async () => {
    const entity = await buildEntity(SCHEMA, { id: '1', name: 'Test' });

    expect(entity).to.exist;
    expect(entity).has.keys('isNew', 'toJSON');
    expect(entity.isNew).to.be.a('function');
    expect(entity.toJSON).to.be.a('function')
  });

  describe('#isNew', () => {
    let schema;

    beforeEach(async () => {
      schema = Joi.object({
        id: Joi.string()
          .optional(),
        name: Joi.string()
          .required()
      });
    });

    it('should return true when entity is new', async () => {
      const entity = await buildEntity(schema, { id: '1', name: 'Test' });

      expect(entity.isNew()).to.be.true;
    });

    it('should return false when entity is not new', async () => {
      const entity = await buildEntity(schema, { name: 'Test' });

      expect(entity.isNew()).to.be.false;
    });
  });

  describe('#toJSON', () => {
    it('should return entity data as json', async () => {
        const entity = await buildEntity(SCHEMA, { id: '1', name: 'Test' });

        expect(entity.toJSON()).to.be.deep.equal({ id: '1', name: 'Test' });
    });
  });
});
