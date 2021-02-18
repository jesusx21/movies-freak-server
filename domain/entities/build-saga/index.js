const buildEntity = require('../build-entity');
const schema = require('./schema');

async function buildSagaEntity(sagaData) {
  const saga = { ...sagaData }
  const entity = await buildEntity(schema, saga, 'Saga');

  return entity;
}

module.exports = buildSagaEntity;
